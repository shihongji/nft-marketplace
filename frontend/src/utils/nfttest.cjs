const ethers = require('ethers');
require('dotenv').config();

const FACTORY_ADDRESS = "0xc8E47b0c905beA0ac6afF2E122Ed3cf93f3fD33c";
const FACTORY_ABI = [
  "function testFunction() public pure returns (bool)",
  "function addAcceptedToken(address token) public",
  "function isTokenAccepted(address token) public view returns (bool)",
  "function getAcceptedTokens() public view returns (address[])",
  "function getPaymentProcessorAddress() public view returns (address)"
];

async function testNFTFactory() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

  try {
    // Test basic functionality
    const testResult = await factory.testFunction();
    console.log("Test function result:", testResult);

    // Get PaymentProcessor address
    const paymentProcessorAddress = await factory.getPaymentProcessorAddress();
    console.log("PaymentProcessor address:", paymentProcessorAddress);

    // Add a test token
    const TEST_TOKEN_ADDRESS = "0x9526f0a0DC571100B173E48C3840BDC537bF53F8";
    console.log("Attempting to add token:", TEST_TOKEN_ADDRESS);

    const addTx = await factory.addAcceptedToken(TEST_TOKEN_ADDRESS, {
      gasLimit: 200000 // Set a manual gas limit
    });
    const receipt = await addTx.wait();
    console.log("Token added, transaction hash:", addTx.hash);
    console.log("Transaction receipt:", receipt);

    // Check if the token is accepted
    const isAccepted = await factory.isTokenAccepted(TEST_TOKEN_ADDRESS);
    console.log("Is token accepted:", isAccepted);

    // Get all accepted tokens
    const acceptedTokens = await factory.getAcceptedTokens();
    console.log("Accepted tokens:", acceptedTokens);

  } catch (error) {
    console.error("Error:", error);
    if (error.error && error.error.data) {
      const iface = new ethers.utils.Interface(["function Error(string)"]);
      try {
        const decodedError = iface.decodeErrorResult("Error", error.error.data);
        console.error("Decoded error:", decodedError);
      } catch (decodeError) {
        console.error("Failed to decode error:", decodeError);
      }
    }
  }
}

testNFTFactory().catch(console.error);
