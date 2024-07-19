// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CollectionNFT.sol";

contract NFTFactory is Ownable {
    // Event emitted when a new collection is created
    event CollectionCreated(address collectionAddress, string name, string symbol, address owner);

    // Mapping to store collections created by each user
    mapping(address => address[]) public userCollections;

    // Constructor sets the contract deployer as the owner
    constructor() Ownable(msg.sender) {}

    // Function to create a new NFT collection
    function createCollection(string memory name, string memory symbol) public returns (address) {
        // Deploy a new CollectionNFT contract
        CollectionNFT newCollection = new CollectionNFT(name, symbol, msg.sender);
        address collectionAddress = address(newCollection);
        
        // Add the new collection to the user's list of collections
        userCollections[msg.sender].push(collectionAddress);
        
        // Emit an event to log the creation of the new collection
        emit CollectionCreated(collectionAddress, name, symbol, msg.sender);
        
        // Return the address of the newly created collection
        return collectionAddress;
    }

    // Function to get all collections created by a specific user
    function getUserCollections(address user) public view returns (address[] memory) {
        return userCollections[user];
    }
}
