// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFTFactory.sol";

contract NFTFactoryV2 is NFTFactory {
    function version() public pure override returns (uint256) {
        return 2;
    }

    function createCollection(
        string memory name,
        string memory symbol,
        string memory ipfsUrl
    ) public override returns (address) {
        return super.createCollection(string(abi.encodePacked("v2_", name)), symbol, ipfsUrl);
    }
}