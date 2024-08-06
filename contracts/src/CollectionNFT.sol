// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollectionNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string public collectionImageURI;

    constructor(
        string memory name,
        string memory symbol,
        string memory _collectionImageURI,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        collectionImageURI = _collectionImageURI;
    }

    function safeMint(address to, string memory uri) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (bool) 
    {
        return ERC721.supportsInterface(interfaceId) || ERC721URIStorage.supportsInterface(interfaceId);
    }
}