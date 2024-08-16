
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PaymentProcessor.sol";

contract CollectionNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string public collectionImageURI;
    PaymentProcessor public paymentProcessor;
    uint256 public mintPrice;

    constructor(
        string memory name,
        string memory symbol,
        string memory _collectionImageURI,
        address initialOwner,
        address _paymentProcessor,
        uint256 _mintPrice
    ) ERC721(name, symbol) Ownable(initialOwner) {
        collectionImageURI = _collectionImageURI;
        paymentProcessor = PaymentProcessor(_paymentProcessor);
        mintPrice = _mintPrice;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    function safeMintWithPayment(
        address to,
        string memory uri,
        address paymentToken
    ) public {
        require(
            paymentProcessor.acceptedTokens(paymentToken),
            "Token not accepted"
        );
        uint256 tokenPrice = paymentProcessor.tokenPrices(paymentToken);
        require(tokenPrice > 0, "Token price not set");

        uint256 tokenAmount = (mintPrice * 10 ** 18) / tokenPrice;
        paymentProcessor.processPayment(
            paymentToken,
            tokenAmount,
            msg.sender,
            owner()
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function setPaymentProcessor(address _paymentProcessor) public onlyOwner {
        paymentProcessor = PaymentProcessor(_paymentProcessor);
    }
}

