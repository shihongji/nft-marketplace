// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CollectionNFT.sol";

contract NFTFactory {
    event CollectionCreated(address collectionAddress, string name, string symbol, string ipfsUrl, address owner);

    mapping(address => address[]) public userCollections;

    function createCollection(string memory name, string memory symbol, string memory ipfsUrl) public returns (address) {
        CollectionNFT newCollection = new CollectionNFT(name, symbol, ipfsUrl, msg.sender);
        address collectionAddress = address(newCollection);
        
        userCollections[msg.sender].push(collectionAddress);
        
        emit CollectionCreated(collectionAddress, name, symbol, ipfsUrl, msg.sender);
        
        return collectionAddress;
    }

    function getUserCollections(address user) public view returns (address[] memory) {
        return userCollections[user];
    }
}
