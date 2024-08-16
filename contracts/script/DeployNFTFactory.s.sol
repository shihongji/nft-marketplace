
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFTFactory.sol";
import "../src/PaymentProcessor.sol";
import "../src/TestERC20Token.sol";

contract DeployNFTFactory is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PaymentProcessor
        PaymentProcessor paymentProcessor = new PaymentProcessor();
        console.log("PaymentProcessor deployed to:", address(paymentProcessor));

        // Deploy NFTFactory with PaymentProcessor address
        NFTFactory nftFactory = new NFTFactory(address(paymentProcessor));
        console.log("NFTFactory deployed to:", address(nftFactory));

        // Deploy TestERC20Token
        TestERC20Token testToken = new TestERC20Token("Test Token", "TEST");
        console.log("TestERC20Token deployed to:", address(testToken));

        // Set up the test token in the PaymentProcessor
        paymentProcessor.addToken(address(testToken));
        paymentProcessor.setTokenPrice(address(testToken), 1e18); // 1 TEST = 1 USD

        vm.stopBroadcast();
    }
}
