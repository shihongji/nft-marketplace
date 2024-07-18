// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// MyNFT contract definition, inheriting from ERC721, ERC721URIStorage, and Ownable
contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    // Private variable to keep track of the next token ID to be minted
    uint256 private _nextTokenId;

    // Constructor function, called when the contract is deployed
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {}

    // Function to mint a new NFT
    // Only the contract owner can call this function (enforced by onlyOwner modifier)
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.
    // Function to get the URI (metadata location) of a specific token
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Function to check if the contract supports a given interface
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
