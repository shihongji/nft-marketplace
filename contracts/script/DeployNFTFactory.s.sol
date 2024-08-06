// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {NFTFactory} from "../src/NFTFactory.sol";

contract DeployNFTFactory is Script {
    function run() external returns (address) {
        vm.startBroadcast();
        NFTFactory factory = new NFTFactory();
        factory.initialize(msg.sender);
        vm.stopBroadcast();
        return address(factory);
    }
}