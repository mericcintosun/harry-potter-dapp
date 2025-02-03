// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFTAuction is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

//    function mint(address to, string memory tokenURI) public onlyOwner {
//        uint256 tokenId = _tokenIdCounter.current();
//        _safeMint(to, tokenId);
//        _setTokenURI(tokenId, tokenURI);
//        _tokenIdCounter.increment();
//    }

// Counters.sol kaldırılmış, onun yerine yeni önerilene değiştirdim.
// https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4233#issuecomment-1561791911

    function mint(address receiver) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(receiver, tokenId);
        _tokenIdCounter += 1;
    }

    // Açık artırma için bir yapı
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 currentPrice;
        uint256 endTime;
        address highestBidder;
    }

    // Her token için bir açık artırma
    mapping(uint256 => Auction) public auctions;
    
    // Açık artırma başlatma
    function startAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "You must own the NFT to start an auction");

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            currentPrice: startingPrice,
            endTime: block.timestamp + duration,
            highestBidder: address(0)
        });
    }

    // Teklif verme
    function placeBid(uint256 tokenId) public payable {
        Auction storage auction = auctions[tokenId];

        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.currentPrice, "Bid must be higher than the current price");

        // Önceki teklif veren geri ödeniyor
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.currentPrice);
        }

        auction.currentPrice = msg.value;
        auction.highestBidder = msg.sender;
    }

    // Açık artırmayı bitirip NFT'yi kazanan kişiye transfer etme
    function endAuction(uint256 tokenId) public {
        Auction storage auction = auctions[tokenId];

        require(block.timestamp >= auction.endTime, "Auction is still ongoing");
        require(msg.sender == auction.seller, "Only the seller can end the auction");

        // Kazanan kişi NFT'yi alır
        _transfer(auction.seller, auction.highestBidder, tokenId);

        // Satıcıya ödeme yapılır
        payable(auction.seller).transfer(auction.currentPrice);

        // Açık artırma bitirilir
        delete auctions[tokenId];
    }

    // Toplam NFT sayısını döndürme
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}