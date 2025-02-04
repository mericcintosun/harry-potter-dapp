// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // birden çok collection olma ihtimaline karşı dinamik sembol || eski versiyon: "MyNFT", "MNFT"
    // explicit constructor kaldırılmış herhalde forge compile'lamıyor, inline constructor'a çevirdim.
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {}

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

    // Toplam NFT sayısını döndürme
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}