pragma solidity ^0.8.20;

import {NFTFactory} from "./NFTFactory.sol";

contract NFTFactoryV2 is NFTFactory {
    function version() public pure override returns (uint256) {
        return 2;
    }

    function strConcat(string memory _a, string memory _b) internal returns (string memory){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++)bret[k++] = _ba[i];
        for (uint i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(ret);
   }  

    function createCollection(string memory name, string memory symbol, string memory ipfsUrl) public override returns (address) {
        return super.createCollection(strConcat("c_",name), symbol, ipfsUrl);
    }
}