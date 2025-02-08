    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    import "./Auction.sol";

    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/utils/Address.sol";
    import "@openzeppelin/contracts/utils/Pausable.sol";
    import "@openzeppelin/contracts/interfaces/IERC721.sol";
    import "./NFT_FixedSupply.sol";
    import "./NFT_Collection.sol";

    contract Marketplace is Ownable, Pausable {
        using Address for address;

        uint256 public ownerCutPerMillion; // Owner's share of sales
        uint256 public publicationFeeInWei; // Fee to publish an order

        // NFT'nin kontrat adresi o kontrattaki tüm NFT'lerin auctionlarını dönderiyor.
        // Mapping nestli olduğundan nftAuctions[Adress][Id] kullanarak spesifik bir NFT'nin auctionına erişebiliyoruz.
        // Örneğin: nftAuctions[0x20ee7b720f4e4...][100];
        mapping(address => mapping(uint256 => Auction)) public nftAuctions;

        mapping(address => mapping(uint256 => Order)) public nftOrders;
        struct Order {
            address seller;
            uint256 price;
            uint256 expiresAt;
        }

        // events
        event OrderCreated(address indexed seller, address indexed nftAddress, uint256 indexed assetId, uint256 priceInWei, uint256 expiresAt);
        event OrderCancelled(address indexed seller, address indexed nftAddress, uint256 indexed assetId);
        event OrderSuccessful(address indexed buyer, address indexed nftAddress, uint256 indexed assetId, uint256 price);
        event AuctionCreated(address indexed seller, address indexed nftAddress, uint256 indexed assetId, uint256 auctionEndTime);
        event AuctionEnded(address indexed winner, uint256 amount);

        // errorlar
        error AuctionAlreadyEnded();
        error BidNotHighEnough(uint256 highestBid);
        error AuctionNotYetEnded();
        error AuctionEndAlreadyCalled();

        // constructor
        constructor(uint256 _ownerCutPerMillion) Ownable(msg.sender) {
            ownerCutPerMillion = _ownerCutPerMillion;
        }

        // Function to set the publication fee (for listing items)
        function setPublicationFee(uint256 _publicationFee) external onlyOwner {
            publicationFeeInWei = _publicationFee;
            // Emit event
        }

        // Function to create order
        function createOrder(address nftAddress, uint256 assetId, uint256 priceInWei, uint256 expiresAt) external payable whenNotPaused {
            IERC721 nftRegistry = IERC721(nftAddress);
            require(nftRegistry.ownerOf(assetId) == msg.sender, "You are not the owner of this NFT");
            require(nftRegistry.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved to transfer this NFT");
            require(expiresAt > block.timestamp, "Invalid expiration time");
            require(priceInWei > 0, "Price must be greater than zero");
            //check and transfer the fee to owner (of the contract).
            require(msg.value >= publicationFeeInWei, "Insufficient publication fee");
            payable(owner()).transfer(publicationFeeInWei);
            nftOrders[nftAddress][assetId] = Order({
                seller: msg.sender,
                price: priceInWei,
                expiresAt: expiresAt
            });
            emit OrderCreated(msg.sender, nftAddress, assetId, priceInWei, expiresAt);
        }

        // Function to cancel order
        function cancelOrder(address nftAddress, uint256 assetId) external whenNotPaused {
            Order memory order = nftOrders[nftAddress][assetId];
            require(order.seller == msg.sender, "This NFT is not listed by you");
            delete nftOrders[nftAddress][assetId];
            emit OrderCancelled(msg.sender, nftAddress, assetId);

    }

        function executeOrder(address nftAddress, uint256 assetId) external payable whenNotPaused {
            Order memory order = nftOrders[nftAddress][assetId];
            require(order.seller != msg.sender, "Seller cannot buy their own NFT");
            require(order.seller != address(0), "This NFT is not listed for sale");
            require(msg.value >= order.price, "Payment failed");
            payable(order.seller).transfer(msg.value);
            IERC721(nftAddress).safeTransferFrom(order.seller, msg.sender, assetId);
            delete nftOrders[nftAddress][assetId];
            emit OrderSuccessful(msg.sender, nftAddress, assetId, msg.value);
        }

        function createNFT(
            bool isFixedSupply,
            address creator,
            string memory name,
            string memory symbol,
            uint256 maxSupply,
            string memory baseURI
        ) external onlyOwner whenNotPaused {
            address nftAddress;

            if (isFixedSupply) {
                nftAddress = address(new NFT(name, symbol, maxSupply, baseURI));
            } else {
                nftAddress = address(new NFT_C(name, symbol, maxSupply, baseURI));
            }
        }

        function createAuction(address nftAddress, uint256 assetId, uint256 biddingTime) external whenNotPaused {
            Auction auction = new Auction(biddingTime, payable(msg.sender));
            nftAuctions[nftAddress][assetId] = auction;

            // Auction.sol'un kendisinde emit olmadığından, marketplace'de çağıralım.
            emit AuctionCreated(msg.sender, nftAddress, assetId, block.timestamp + biddingTime);
        }

        function bidOnAuction(address nftAddress, uint256 assetId) external payable whenNotPaused {
            Auction auction = nftAuctions[nftAddress][assetId];

            // Auction.sol'daki bid fonksiyonu payable olduğundan msg.value ile yüklü gelecek.
            // O yüzden parametre şeklinde değilde böyle gönderiyoruz.
            auction.bid{value: msg.value}();
        }

        function withdrawBid(address nftAddress, uint256 assetId) external whenNotPaused {
            Auction auction = nftAuctions[nftAddress][assetId];
            bool success = auction.withdraw();
            require(success, "Withdrawal failed");
        }

        function endAuction(address nftAddress, uint256 assetId) external whenNotPaused {

            Auction auction = nftAuctions[nftAddress][assetId];
            auction.auctionEnd();

            address highestBidder = auction.highestBidder();
            // msg.sender kısmı sıkıntılı olabilir, Auction.sol:auctionEnd() çağıran kişi satıcı mı olacak..?
            // IERC721(nftAddress).safeTransferFrom(nftRegistry.ownerOf(assetId), highestBidder, assetId) bu da doğru olabilir.
            IERC721(nftAddress).safeTransferFrom(msg.sender, highestBidder, assetId);


            // Auction.sol:auctionEnd() kendisi emitlediğinden ekstra koymuyorum.
        }

        function _requireERC721(address nftAddress) internal view {
            require(IERC721(nftAddress).supportsInterface(0x80ac58cd), "Address is not a valid ERC721 contract");
        }

        // gerekli olmayabilir
        function _checkAuctionStatus(address _unusedNftAddress, uint256 _unusedAssetId) internal pure returns (bool) {
            return true;
        }

        }

    }
