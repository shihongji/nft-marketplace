const { ethers } = require('ethers');
require('dotenv').config();

const FACTORY_ADDRESS = "0xA0184c9b317f09Faa009DBA50E7f7663BB3AB8be";
const FACTORY_ABI = [
  "function addAcceptedToken(address token) public",
  "function getAcceptedTokens() public view returns (address[])",
  "function owner() public view returns (address)"
];

async function addAcceptedToken(tokenAddress) {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("SEPOLIA_RPC_URL or PRIVATE_KEY is not set in the environment variables");
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

  try {
    // Log contract owner and caller address
    const contractOwner = await factory.owner();
    console.log(`Contract owner: ${contractOwner}`);
    console.log(`Caller address: ${signer.address}`);

    // Check if the caller is the owner
    if (contractOwner.toLowerCase() !== signer.address.toLowerCase()) {
      throw new Error(`Only the contract owner can add tokens. Owner: ${contractOwner}, Caller: ${signer.address}`);
    }

    // Check if the token is already accepted
    const acceptedTokens = await factory.getAcceptedTokens();
    console.log("Currently accepted tokens:", acceptedTokens);
    if (acceptedTokens.includes(tokenAddress)) {
      console.log(`Token ${tokenAddress} is already accepted.`);
      return;
    }

    console.log(`Attempting to add token ${tokenAddress}...`);
    const tx = await factory.addAcceptedToken(tokenAddress, { gasLimit: 100000 });
    console.log(`Transaction sent. Hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Transaction receipt:`, receipt);

    if (receipt.status === 1) {
      console.log(`Token ${tokenAddress} added successfully`);
      const updatedAcceptedTokens = await factory.getAcceptedTokens();
      console.log("Updated accepted tokens:", updatedAcceptedTokens);
    } else {
      console.log(`Transaction failed. Status: ${receipt.status}`);
    }
  } catch (error) {
    console.error("Error adding token:", error);
    if (error.error && error.error.data) {
      const decodedError = factory.interface.parseError(error.error.data);
      if (decodedError) {
        console.error("Decoded error:", decodedError.name, decodedError.args);
      }
    }
  }
}

const tokenToAdd = "0xd73c117de495F1c48a1A8C20F2EbB88F48C87bcA";
addAcceptedToken(tokenToAdd).catch(console.error);

module.exports = { addAcceptedToken };
