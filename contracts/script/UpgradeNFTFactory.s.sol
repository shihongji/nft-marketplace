// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {NFTFactoryV2} from "../src/NFTFactoryV2.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {DeployNFTFactory} from "./DeployNFTFactory.s.sol";

contract UpgradeNFTFactory is Script {
    function run() external returns (address) {
        //   address mostRecentlyDeployed =DevOpsTools.get_most_recent_deployment("ERC1967Proxy",block.chainid);
        //   console.log(mostRecentlyDeployed);
        DeployNFTFactory deployer = new DeployNFTFactory();
        address _currentProxy = deployer.run();
        vm.startBroadcast();
        NFTFactoryV2 newNFTFactory = new NFTFactoryV2();
        vm.stopBroadcast();
        address newProxy = upgradeNFTFactory(_currentProxy, address(newNFTFactory));
        return address(newProxy);
    }

    function upgradeNFTFactory(address _proxy, address _newOne) public returns (address) {
        vm.startBroadcast();
        NFTFactory proxy = NFTFactory(payable(_proxy));
        proxy.upgradeToAndCall(address(_newOne), new bytes(0));
        vm.stopBroadcast();
        return address(proxy);
    }
}