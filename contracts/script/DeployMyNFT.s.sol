// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyNFT.sol";

contract DeployMyNFT is Script {
    function run() external {
        // Retrieve the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions from the deployer account
        vm.startBroadcast(deployerPrivateKey);

        // Deploy a new instance of the MyNFT contract
        // Parameters: name of the NFT collection, symbol for the NFT
        MyNFT nft = new MyNFT("MyNFT", "MNFT");

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Note: The deployed contract address will be printed in the console output
    }
}
