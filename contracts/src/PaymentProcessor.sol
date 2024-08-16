// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentProcessor is Ownable {
    mapping(address => bool) public acceptedTokens;
    mapping(address => uint256) public tokenPrices;

    event TokenAdded(address token);
    event TokenRemoved(address token);
    event PriceSet(address token, uint256 price);

    constructor() Ownable(msg.sender) {}

    function addToken(address token) external onlyOwner {
        acceptedTokens[token] = true;
        emit TokenAdded(token);
    }

    function removeToken(address token) external onlyOwner {
        acceptedTokens[token] = false;
        emit TokenRemoved(token);
    }

    function setTokenPrice(address token, uint256 price) external onlyOwner {
        require(acceptedTokens[token], "Token not accepted");
        tokenPrices[token] = price;
        emit PriceSet(token, price);
    }

    function processPayment(
        address token,
        uint256 amount,
        address payer,
        address payee
    ) external returns (bool) {
        require(acceptedTokens[token], "Token not accepted");
        require(tokenPrices[token] > 0, "Token price not set");
        
        IERC20 tokenContract = IERC20(token);
        require(tokenContract.transferFrom(payer, payee, amount), "Payment failed");
        
        return true;
    }
}
