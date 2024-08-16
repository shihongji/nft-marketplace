import React, { useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { parseAbi } from "viem";

const NFT_FACTORY_ADDRESS =
  "0xCD75057E0cC025e842dA1fC1524c76ad4a58B777" as const;

const factoryABI = parseAbi([
  "function getUserCollections(address user) view returns (address[])",
]);

const collectionABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function collectionImageURI() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

interface NFTCollection {
  address: `0x${string}`;
  name: string;
  symbol: string;
  imageURI: string;
  nfts: { tokenId: number; tokenURI: string }[];
}

export const ViewNFTs: React.FC = () => {
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
    ]),
  });

  useEffect(() => {
    if (collectionsData && userCollections) {
      const newCollections: NFTCollection[] = [];
      for (let i = 0; i < collectionsData.length; i += 4) {
        newCollections.push({
          address: userCollections[i / 4],
          name: collectionsData[i].result as string,
          symbol: collectionsData[i + 1].result as string,
          imageURI: collectionsData[i + 2].result as string,
          nfts: [],
        });
      }
      setCollections(newCollections);
    }
  }, [collectionsData, userCollections]);

  // Fetch NFTs for each collection
  useEffect(() => {
    const fetchNFTs = async () => {
      const updatedCollections = await Promise.all(collections.map(async (collection) => {
        const balance = await useReadContract({
          address: collection.address,
          abi: collectionABI,
          functionName: "balanceOf",
          args: [address ?? "0x0"],
        });

        const nfts = await Promise.all(Array.from({ length: Number(balance) }, (_, i) => i).map(async (tokenId) => {
          const tokenURI = useReadContract({
            address: collection.address,
            abi: collectionABI,
            functionName: "tokenURI",
            args: [BigInt(tokenId)],
          });
          return { tokenId, tokenURI: tokenURI as string };
        }));

        return { ...collection, nfts };
      }));

      setCollections(updatedCollections);
    };

    if (collections.length > 0 && address) {
      fetchNFTs();
    }
  }, [collections, address]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your NFT Collections</h2>
      {collections.map((collection) => (
        <div key={collection.address} className="border p-4 rounded-lg">
          <h3 className="text-xl font-bold">{collection.name} ({collection.symbol})</h3>
          <img src={collection.imageURI} alt={`${collection.name} collection`} className="w-32 h-32 object-cover mt-2" />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {collection.nfts.map((nft) => (
              <div key={nft.tokenId} className="border p-2 rounded">
                <p>Token ID: {nft.tokenId}</p>
                <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} className="w-full h-auto mt-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewNFTs;
