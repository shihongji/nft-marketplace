import React, { useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { parseAbi, formatEther } from "viem";
import { Link } from "react-router-dom"; // Import Link for routing

const NFT_FACTORY_ADDRESS = "0xCD75057E0cC025e842dA1fC1524c76ad4a58B777" as const;

const factoryABI = parseAbi([
  "function getUserCollections(address user) view returns (address[])",
]);

const collectionABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function collectionImageURI() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function mintPrice() view returns (uint256)",
  "function paymentToken() view returns (address)",
]);

interface NFTCollection {
  address: `0x${string}`;
  name: string;
  symbol: string;
  imageURI: string;
  mintPrice: string;
  paymentToken: `0x${string}`;
  balance: number;
}


const ipfsToHttp = (url: string): string => {
  if (url.includes('.ipfs.w3s.link')) {
    const cid = url.split('.ipfs.w3s.link')[0].split('//')[1];
    return `https://ipfs.io/ipfs/${cid}/`;
  }
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`;
  }
  return url;
};


const ImageWithFallback: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  if (loading) return <div>Loading image...</div>;
  if (error) return <div>Error loading image. URL: {src}</div>;
  return <img src={imgSrc} alt={alt} className="w-32 h-32 object-cover mt-2" />;
};

export const ViewCollections: React.FC = () => {
  const { address } = useAccount();
  const [collections, setCollections] = useState<NFTCollection[]>([]);

  const { data: userCollections } = useReadContract({
    address: NFT_FACTORY_ADDRESS,
    abi: factoryABI,
    functionName: "getUserCollections",
    args: [address ?? "0x0"],
  });

  const { data: collectionsData } = useReadContracts({
    contracts: (userCollections as `0x${string}`[] || []).flatMap((collection) => [
      { address: collection, abi: collectionABI, functionName: "name" },
      { address: collection, abi: collectionABI, functionName: "symbol" },
      { address: collection, abi: collectionABI, functionName: "collectionImageURI" },
      { address: collection, abi: collectionABI, functionName: "balanceOf", args: [address ?? "0x0"] },
      { address: collection, abi: collectionABI, functionName: "mintPrice" },
      { address: collection, abi: collectionABI, functionName: "paymentToken" },
    ]),
  });

   useEffect(() => {
    if (collectionsData && userCollections) {
      const newCollections: NFTCollection[] = [];
      for (let i = 0; i < collectionsData.length; i += 6) {
        const collectionData = collectionsData.slice(i, i + 6);
        if (collectionData.every(item => item.status === 'success')) {
          newCollections.push({
            address: userCollections[i / 6],
            name: collectionData[0].result as string,
            symbol: collectionData[1].result as string,
            imageURI: ipfsToHttp(collectionData[2].result as string),
            balance: Number(collectionData[3].result),
            mintPrice: formatEther(collectionData[4].result as bigint),
            paymentToken: collectionData[5].result as `0x${string}`,
          });
        }
      }
      setCollections(newCollections);
    }
  }, [collectionsData, userCollections]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your NFT Collections</h2>
      {collections.map((collection) => (
        <div key={collection.address} className="border p-4 rounded-lg">
          <h3 className="text-xl font-bold">{collection.name} ({collection.symbol})</h3>
          <ImageWithFallback src={collection.imageURI} alt={`${collection.name} collection`} />
          <p>Image URL: {collection.imageURI}</p>
          <p>Mint Price: {collection.mintPrice} ETH</p>
          <p>Payment Token: {collection.paymentToken}</p>
          <p>Your Balance: {collection.balance} NFTs</p>
          <Link to={`/view-nfts/${collection.address}`} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
            View NFTs
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ViewCollections;
