// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CollectionNFT.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract NFTFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    event CollectionCreated(address collectionAddress, string name, string symbol, string ipfsUrl, address owner);

    mapping(address => address[]) public userCollections;

     constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender); //set owner to msg.sender
        __UUPSUpgradeable_init();
    }

     function version() public pure virtual returns (uint256) {
        return 1;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function createCollection(string memory name, string memory symbol, string memory ipfsUrl) public virtual returns (address) {
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
