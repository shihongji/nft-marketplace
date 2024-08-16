
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CollectionNFT.sol";
import "./PaymentProcessor.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTFactory is Ownable {
    event CollectionCreated(
        address collectionAddress,
        string name,
        string symbol,
        string ipfsUrl,
        address owner
    );
    event TokenAdded(address token);
    event TokenRemoved(address token);

    mapping(address => address[]) public userCollections;
    PaymentProcessor public paymentProcessor;
    mapping(address => bool) public acceptedTokens;
    address[] public acceptedTokensList;
    address public constant ETH_ADDRESS = address(0);

    constructor(address _paymentProcessor) Ownable(msg.sender) {
        paymentProcessor = PaymentProcessor(_paymentProcessor);
        acceptedTokens[ETH_ADDRESS] = true; // ETH is always accepted
        acceptedTokensList.push(ETH_ADDRESS);
    }

    function createCollection(
        string memory name,
        string memory symbol,
        string memory ipfsUrl,
        uint256 mintPrice,
        address paymentToken
    ) public payable returns (address) {
        require(bytes(name).length > 0, "NFTFactory: Name cannot be empty");
        require(bytes(symbol).length > 0, "NFTFactory: Symbol cannot be empty");
        require(
            bytes(ipfsUrl).length > 0,
            "NFTFactory: IPFS URL cannot be empty"
        );
        require(mintPrice > 0, "NFTFactory: Mint price must be greater than 0");
        require(acceptedTokens[paymentToken], "NFTFactory: Token not accepted");

        CollectionNFT newCollection;
        if (paymentToken == ETH_ADDRESS) {
            require(
                msg.value >= mintPrice,
                "NFTFactory: Insufficient ETH sent"
            );
            try
                new CollectionNFT(
                    name,
                    symbol,
                    ipfsUrl,
                    msg.sender,
                    address(paymentProcessor),
                    mintPrice
                )
            returns (CollectionNFT collection) {
                newCollection = collection;
            } catch Error(string memory reason) {
                revert(
                    string(
                        abi.encodePacked(
                            "NFTFactory: Failed to create collection: ",
                            reason
                        )
                    )
                );
            } catch {
                revert(
                    "NFTFactory: Failed to create collection for unknown reason"
                );
            }

            // Transfer ETH to contract owner
            (bool sent, ) = payable(owner()).call{value: msg.value}("");
            require(sent, "NFTFactory: Failed to send ETH to owner");
        } else {
            try
                new CollectionNFT(
                    name,
                    symbol,
                    ipfsUrl,
                    msg.sender,
                    address(paymentProcessor),
                    mintPrice
                )
            returns (CollectionNFT collection) {
                newCollection = collection;
            } catch Error(string memory reason) {
                revert(
                    string(
                        abi.encodePacked(
                            "NFTFactory: Failed to create collection: ",
                            reason
                        )
                    )
                );
            } catch {
                revert(
                    "NFTFactory: Failed to create collection for unknown reason"
                );
            }

            bool paymentSuccess = paymentProcessor.processPayment(
                paymentToken,
                mintPrice,
                msg.sender,
                owner()
            );
            require(paymentSuccess, "NFTFactory: Payment failed");
        }

        address collectionAddress = address(newCollection);
        userCollections[msg.sender].push(collectionAddress);

        emit CollectionCreated(
            collectionAddress,
            name,
            symbol,
            ipfsUrl,
            msg.sender
        );

        return collectionAddress;
    }

    function getUserCollections(
        address user
    ) public view returns (address[] memory) {
        return userCollections[user];
    }

    function addAcceptedToken(address token) public onlyOwner {
        require(token != address(0), "NFTFactory: Invalid token address");
        require(!acceptedTokens[token], "NFTFactory: Token already accepted");

        // Check if the token is a valid ERC20 token
        try IERC20(token).totalSupply() returns (uint256) {
            // Token is valid, proceed with adding it
            acceptedTokens[token] = true;
            acceptedTokensList.push(token);
            if (token != ETH_ADDRESS) {
                try paymentProcessor.addToken(token) {
                    // Token successfully added to payment processor
                } catch Error(string memory reason) {
                    revert(
                        string(
                            abi.encodePacked(
                                "NFTFactory: Failed to add token to payment processor: ",
                                reason
                            )
                        )
                    );
                }
            }
            emit TokenAdded(token);
        } catch {
            revert("NFTFactory: Invalid ERC20 token");
        }
    }
    function removeAcceptedToken(address token) public onlyOwner {
        require(token != ETH_ADDRESS, "Cannot remove ETH as accepted payment");
        require(acceptedTokens[token], "Token not accepted");

        acceptedTokens[token] = false;
        paymentProcessor.removeToken(token);

        // Remove token from acceptedTokensList
        for (uint i = 0; i < acceptedTokensList.length; i++) {
            if (acceptedTokensList[i] == token) {
                acceptedTokensList[i] = acceptedTokensList[
                    acceptedTokensList.length - 1
                ];
                acceptedTokensList.pop();
                break;
            }
        }

        emit TokenRemoved(token);
    }

    function getAcceptedTokens() public view returns (address[] memory) {
        return acceptedTokensList;
    }

    function isTokenAccepted(address token) public view returns (bool) {
        return acceptedTokens[token];
    }

    // Simple test function
    function testFunction() public pure returns (bool) {
        return true;
    }
    // Add this function to get the payment processor address
    function getPaymentProcessorAddress() public view returns (address) {
        return address(paymentProcessor);
    }

    receive() external payable {}
}

