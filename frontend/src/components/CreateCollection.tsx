import React, { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseAbi } from "viem";
import { sepolia } from "../wagmi";

const FACTORY_ADDRESS =
  "0x533Bd7f13F697609af09ee17AC1F073e7fF3F517" as `0x${string}`;

const factoryABI = parseAbi([
  "function createCollection(string memory name, string memory symbol) public returns (address)",
]);

const CreateCollection: React.FC = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const chainId = useChainId();

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    console.log("Wallet connected:", isConnected);
    console.log("Current chain ID:", chainId);
    console.log("Expected chain ID (Sepolia):", sepolia.id);
  }, [isConnected, chainId]);

  useEffect(() => {
    if (writeError) {
      console.error("Write contract error:", writeError);
      setError(`Error: ${writeError.message}`);
    }
  }, [writeError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Submitting form...", { name, symbol });

    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (chainId !== sepolia.id) {
      setError(
        `Please switch to Sepolia network. Current chain ID: ${chainId}`,
      );
      return;
    }

    try {
      console.log("Attempting to create collection...");
      writeContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: "createCollection",
        args: [name, symbol],
      });
      console.log("Write contract call initiated");
    } catch (err) {
      console.error("Error creating collection:", err);
      setError(
        `Failed to create collection: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Collection Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label
          htmlFor="symbol"
          className="block text-sm font-medium text-gray-700"
        >
          Collection Symbol
        </label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isConfirming}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isConfirming ? "Creating..." : "Create Collection"}
      </button>
      {isSuccess && (
        <p className="text-green-600">Collection created successfully!</p>
      )}
      {error && <p className="text-red-600">{error}</p>}
      <p>Connected: {isConnected ? "Yes" : "No"}, Chain ID: {chainId}</p>
    </form>
  );
};

export default CreateCollection;
