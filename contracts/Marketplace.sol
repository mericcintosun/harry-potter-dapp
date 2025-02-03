// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Auction.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract Marketplace is Ownable, Pausable {
    using Address for address;

    address public acceptedToken; // The ERC20 token used for transactions
    uint256 public ownerCutPerMillion; // Owner's share of sales
    uint256 public publicationFeeInWei; // Fee to publish an order

    // NFT'nin kontrat adresi o kontrattaki tüm NFT'lerin auctionlarını dönderiyor.
    // Mapping nestli olduğundan nftAuctions[Adress][Id] kullanarak spesifik bir NFT'nin auctionına erişebiliyoruz.
    // Örneğin: nftAuctions[0x20ee7b720f4e4...][100];
    mapping(address => mapping(uint256 => Auction)) public nftAuctions;

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
    constructor(address _acceptedToken, uint256 _ownerCutPerMillion) {
        acceptedToken = _acceptedToken;
        ownerCutPerMillion = _ownerCutPerMillion;
    }

    // Function to set the publication fee (for listing items)
    function setPublicationFee(uint256 _publicationFee) external onlyOwner {
        publicationFeeInWei = _publicationFee;
        // Emit event
    }

    function createOrder(address nftAddress, uint256 assetId, uint256 priceInWei, uint256 expiresAt) external whenNotPaused {
    }

    function cancelOrder(address nftAddress, uint256 assetId) external whenNotPaused {
    }

    function executeOrder(address nftAddress, uint256 assetId, uint256 price) external whenNotPaused {
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
    }

    // gerekli olmayabilir
    function _checkAuctionStatus(address nftAddress, uint256 assetId) internal view returns (bool) {
        //
        //
        //
        return false;
    }

}
