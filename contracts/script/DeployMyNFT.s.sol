
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CollectionNFT.sol";
import "../src/PaymentProcessor.sol";
import "../src/TestERC20Token.sol";

contract DeployMyNFT is Script {
    function run() external {
        // Retrieve the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions from the deployer account
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PaymentProcessor
        PaymentProcessor paymentProcessor = new PaymentProcessor();
        console.log("PaymentProcessor deployed to:", address(paymentProcessor));

        // Deploy TestERC20Token for testing purposes
        TestERC20Token testToken = new TestERC20Token("Test Token", "TEST");
        console.log("TestERC20Token deployed to:", address(testToken));

        // Set up the test token in the PaymentProcessor
        paymentProcessor.addToken(address(testToken));
        paymentProcessor.setTokenPrice(address(testToken), 1e18); // 1 TEST = 1 USD

        // Deploy a new instance of the CollectionNFT contract
        // Parameters: name, symbol, collectionImageURI, initialOwner, paymentProcessor, mintPrice
        CollectionNFT nft = new CollectionNFT(
            "MyNFT",
            "MNFT",
            "ipfs://your_collection_image_uri_here",
            msg.sender,
            address(paymentProcessor),
            100 * 1e18 // Set mint price to 100 USD (assuming 18 decimals)
        );
        console.log("CollectionNFT deployed to:", address(nft));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
