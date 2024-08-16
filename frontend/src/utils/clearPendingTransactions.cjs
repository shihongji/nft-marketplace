const ethers = require('ethers');
require('dotenv').config();

async function clearPendingTransactions() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log(`Clearing pending transactions for address: ${wallet.address}`);

  try {
    // Get the current nonce
    const currentNonce = await provider.getTransactionCount(wallet.address, "pending");
    console.log(`Current nonce: ${currentNonce}`);

    // Send multiple 0 ETH transactions to yourself
    for (let i = 0; i < 2; i++) {
      const tx = await wallet.sendTransaction({
        to: wallet.address,
        value: ethers.utils.parseEther("0"),
        nonce: currentNonce + i,
        gasPrice: await provider.getGasPrice(),
        gasLimit: 21000  // Standard gas limit for a simple transfer
      });

      console.log(`Transaction ${i + 1} sent. Hash: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction ${i + 1} mined.`);
    }

    console.log("All transactions sent and mined. Pending transactions should be cleared.");
  } catch (error) {
    console.error("Error clearing pending transactions:", error);
  }
}

clearPendingTransactions().catch(console.error);
