import React, { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseAbi } from "viem";
import { sepolia } from "../wagmi";
import { uploadToIPFS } from "../utils/ipfs";

const FACTORY_ADDRESS =
  "0x7dA41Ed5A6607532bA4E9893C63c58F4e407b479" as `0x${string}`;

const factoryABI = parseAbi([
  "function createCollection(string memory name, string memory symbol, string imageUrl) public returns (address)",
]);

const CreateCollection: React.FC = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isConnected } = useAccount();
  const chainId = useChainId();

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Submitting form...", { name, symbol, file });

    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (chainId !== sepolia.id) {
      setError(
        `Please switch to Sepolia network. Current chain ID: ${chainId}`
      );
      return;
    }

    if (!file) {
      setError("Please select an image file");
      return;
    }

    try {
      setIsUploading(true);
      console.log("Uploading image to IPFS...");
      
      // Create a File object with a path-like name
      const fileWithPath = new File([file], `nft-collections/${file.name}`, { type: file.type });
      
      const imageUrl = await uploadToIPFS(fileWithPath);
      setIsUploading(false);
      console.log("Image uploaded to IPFS:", imageUrl);

      console.log("Attempting to create collection...");
      writeContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: "createCollection",
        args: [name, symbol, imageUrl],
      });
      console.log("Write contract call initiated");
    } catch (err) {
      setIsUploading(false);
      console.error("Error creating collection:", err);
      setError(
        `Failed to create collection: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
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
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Collection Image
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="mt-1 block w-full"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isConfirming || isUploading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indio-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isUploading ? "Uploading..." : isConfirming ? "Creating..." : "Create Collection"}
      </button>
      {isSuccess && (
        <p className="text-green-600">Collection created successfully!</p>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
};

export default CreateCollection;
