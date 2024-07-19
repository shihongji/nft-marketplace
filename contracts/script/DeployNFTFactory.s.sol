// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFTFactory.sol";

contract DeployNFTFactory is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NFTFactory nftFactory = new NFTFactory();
        console.log("NFTFactory deployed to:", address(nftFactory));

        vm.stopBroadcast();
    }
}
