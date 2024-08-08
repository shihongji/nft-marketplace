// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFTFactory.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployNFTFactory is Script {
    function setUp() public {}

    function run() external returns (address) {
        address proxy = deployV1();
        return proxy;
    }

    function deployV1() public returns (address) {
        vm.startBroadcast();
        NFTFactory nftFactory = new NFTFactory();
        console.log("NFTFactory deployed to:", address(nftFactory));
        ERC1967Proxy proxy = new ERC1967Proxy(address(nftFactory), "");
        NFTFactory(address(proxy)).initialize();
        vm.stopBroadcast();
        return address(proxy);
    }
}
