// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CollectionNFT.sol";
import "./PaymentProcessor.sol";

contract NFTFactory {
    event CollectionCreated(address collectionAddress, string name, string symbol, string ipfsUrl, address owner);

    mapping(address => address[]) public userCollections;
    PaymentProcessor public paymentProcessor;

    constructor(address _paymentProcessor) {
        paymentProcessor = PaymentProcessor(_paymentProcessor);
    }

    function createCollection(
        string memory name,
        string memory symbol,
        string memory ipfsUrl,
        uint256 mintPrice
    ) public returns (address) {
        CollectionNFT newCollection = new CollectionNFT(
            name,
            symbol,
            ipfsUrl,
            msg.sender,
            address(paymentProcessor),
            mintPrice
        );
        address collectionAddress = address(newCollection);
        
        userCollections[msg.sender].push(collectionAddress);
        
        emit CollectionCreated(collectionAddress, name, symbol, ipfsUrl, msg.sender);
        
        return collectionAddress;
    }

    function getUserCollections(address user) public view returns (address[] memory) {
        return userCollections[user];
    }

    // Function to add a new accepted token (only factory owner can call this)
    function addAcceptedToken(address token) public {
        paymentProcessor.addToken(token);
    }

    // Function to set the price for a token (only factory owner can call this)
    function setTokenPrice(address token, uint256 price) public {
        paymentProcessor.setTokenPrice(token, price);
    }
}
