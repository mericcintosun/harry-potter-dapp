// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract NFT is ERC721URIStorage, Ownable {
    uint256 public maxSupply;
    uint256 private _tokenIdCounter;
    string public baseURI;

    constructor(string memory _name, string memory _symbol, uint256 _maxSupply, string memory _baseURI)
    ERC721(_name, _symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        baseURI = _baseURI;
    }

    function mint(address receiver) public onlyOwner {
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        uint256 tokenId = _tokenIdCounter;
        _safeMint(receiver, tokenId);
        _tokenIdCounter += 1;
        _setTokenURI(tokenId, baseURI);    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0));
        return baseURI;    }

    // Toplam NFT sayısını döndürme
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}