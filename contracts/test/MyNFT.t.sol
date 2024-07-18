// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";  // Importing Forge's testing framework
import "../src/MyNFT.sol";    // Importing our NFT contract

contract MyNFTTest is Test {
    MyNFT public nft;        // Instance of our NFT contract
    address public owner;    // Address of the contract owner
    address public user;     // Address of a regular user

    // Setup function runs before each test
    function setUp() public {
        owner = address(this);  // Set the test contract as the owner
        user = address(0x1);    // Set a dummy address for the user
        nft = new MyNFT("MyNFT", "MNFT");  // Deploy a new instance of our NFT contract
    }

    // Test the minting functionality
    function testMint() public {
        string memory uri = "ipfs://QmTest";  // Example IPFS URI
        nft.safeMint(user, uri);  // Mint an NFT to the user address
        assertEq(nft.ownerOf(0), user);  // Check if the user now owns the NFT with ID 0
        assertEq(nft.tokenURI(0), uri);  // Check if the token URI is set correctly
    }

    // Test that non-owners cannot mint NFTs
    function testFailMintAsNonOwner() public {
        vm.prank(user);  // Pretend to be the user address
        nft.safeMint(user, "ipfs://QmTest");  // This should fail as user is not the owner
    }
}
