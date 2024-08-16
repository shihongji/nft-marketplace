import React, { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseAbi } from "viem";
import { sepolia } from "../wagmi";
import { uploadToIPFS } from "../utils/ipfs";

const FACTORY_ADDRESS =
  "0xCD75057E0cC025e842dA1fC1524c76ad4a58B777" as `0x${string}`;
// const TEST_TOKEN_ADDRESS =
// "0x086414A4d8A52830d275c044b1029e362aD1cbA7" as `0x${string}`; // Replace with your TestERC20Token address

const factoryABI = parseAbi([
  "function createCollection(string memory name, string memory symbol, string imageUrl, uint256 mintPrice, address paymentToken) public payable returns (address)",
  "function getAcceptedTokens() public view returns (address[])",
]);
const erc20ABI = parseAbi([
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
]);

const CreateCollection: React.FC = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mintPrice, setMintPrice] = useState("");
  const [acceptedTokens, setAcceptedTokens] = useState<`0x${string}`[]>([]);
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(
    null,
  );

  const { isConnected } = useAccount();
  const chainId = useChainId();

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch accepted tokens
  const { data: acceptedTokensData } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryABI,
    functionName: "getAcceptedTokens",
  });
  useEffect(() => {
    if (acceptedTokensData) {
      setAcceptedTokens(acceptedTokensData as `0x${string}`[]);
    }
  }, [acceptedTokensData]);
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
  console.log("Submitting form...", { name, symbol, file, mintPrice, selectedToken });

  if (!isConnected || chainId !== sepolia.id || !file) {
    setError("Please ensure all fields are filled and you're connected to Sepolia");
    return;
  }

  try {
    setIsUploading(true);
    console.log("Uploading image to IPFS...");

    const fileWithPath = new File([file], `nft-collections/${file.name}`, { type: file.type });
    const imageUrl = await uploadToIPFS(fileWithPath);
    setIsUploading(false);
    console.log("Image uploaded to IPFS:", imageUrl);

    console.log("Attempting to create collection...");
    const mintPriceWei = BigInt(mintPrice);
    const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

    if (selectedToken === ETH_ADDRESS) {
      // ETH payment
      writeContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: "createCollection",
        args: [name, symbol, imageUrl, mintPriceWei, ETH_ADDRESS],
        value: mintPriceWei, // Send ETH with the transaction
      });
    } else if (selectedToken) {
      // ERC20 token payment
      // First, approve the token spend
      await writeContract({
        address: selectedToken,
        abi: erc20ABI,
        functionName: "approve",
        args: [FACTORY_ADDRESS, mintPriceWei],
      });
      
      // Then create the collection
      writeContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: "createCollection",
        args: [name, symbol, imageUrl, mintPriceWei, selectedToken],
      });
    } else {
      throw new Error("No payment token selected");
    }

    console.log("Write contract call initiated");
  } catch (err) {
    setIsUploading(false);
    console.error("Error creating collection:", err);
    setError(`Failed to create collection: ${err instanceof Error ? err.message : String(err)}`);
  }
};
  // Handle write error
  useEffect(() => {
    if (writeError) {
      setError(`Transaction failed: ${writeError.message}`);
    }
  }, [writeError]);

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
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700"
        >
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
      <div>
        <label
          htmlFor="mintPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Mint Price (in smallest unit of token)
        </label>
        <input
          type="number"
          id="mintPrice"
          value={mintPrice}
          onChange={(e) => setMintPrice(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label
          htmlFor="paymentToken"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Token
        </label>
        <select
          id="paymentToken"
          value={selectedToken || ""}
          onChange={(e) => setSelectedToken(e.target.value as `0x${string}`)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">Select a token</option>
          {acceptedTokens.length > 0
            ? (
              acceptedTokens.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))
            )
            : <option value="" disabled>No tokens available</option>}
        </select>
        {acceptedTokens.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            No accepted tokens available. Please contact the administrator.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isConfirming || isUploading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indio-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isUploading
          ? "Uploading..."
          : isConfirming
          ? "Creating..."
          : "Create Collection"}
      </button>
      {isSuccess && (
        <p className="text-green-600">Collection created successfully!</p>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
};

export default CreateCollection;
