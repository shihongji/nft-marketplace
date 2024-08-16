// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {DeployNFTFactory} from "../script/DeployNFTFactory.s.sol";
import {UpgradeNFTFactory} from "../script/UpgradeNFTFactory.s.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {NFTFactoryV2} from "../src/NFTFactoryV2.sol";

contract DeployAndUpgradeTest is Test {
    DeployNFTFactory public deployer;
    UpgradeNFTFactory public upgrader;
    address public OWNER = makeAddr("owner");
    address public proxy;

    function setUp() public {
        deployer = new DeployNFTFactory();
        upgrader = new UpgradeNFTFactory();
        proxy = deployer.run(); //right now points to NFTFactoryV1
        console.log(msg.sender);
        console.log(address(this));
    }

    function test_NFTFactoryV1() public {
        uint256 expectedValue = 1;
        assertEq(expectedValue, NFTFactory(proxy).version());
    }

    function test_Upgrade() public {
        NFTFactoryV2 NFTFactory2 = new NFTFactoryV2();

        upgrader.upgradeNFTFactory(proxy, address(NFTFactory2));
        uint256 expectedValue = 2;
        assertEq(expectedValue, NFTFactoryV2(proxy).version());
        console.log(NFTFactoryV2(proxy).createCollection("Test", "TEST", "https://test.com/"));
    }
}
