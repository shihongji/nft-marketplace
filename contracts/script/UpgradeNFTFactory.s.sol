// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {NFTFactoryV2} from "../src/NFTFactoryV2.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {DeployNFTFactory} from "./DeployNFTFactory.s.sol";

contract UpgradeNFTFactory is Script {
    function run() external returns (address) {
        DeployNFTFactory deployer = new DeployNFTFactory();
        address currentProxy = deployer.run();
        
        vm.startBroadcast();
        NFTFactoryV2 newNFTFactory = new NFTFactoryV2();
        vm.stopBroadcast();

        return _upgradeNFTFactory(currentProxy, address(newNFTFactory));
    }

    function _upgradeNFTFactory(address proxyAddress, address newImplementation) internal returns (address) {
        vm.startBroadcast();
        NFTFactory proxy = NFTFactory(payable(proxyAddress));
        proxy.upgradeToAndCall(newImplementation, new bytes(0));
        vm.stopBroadcast();
        return address(proxy);
    }
}