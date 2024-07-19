import React, { useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { parseAbi } from 'viem'

const NFT_FACTORY_ADDRESS = '0x533Bd7f13F697609af09ee17AC1F073e7fF3F517' as const; // Replace with your deployed NFTFactory address

const factoryABI = parseAbi([
  'function getUserCollections(address user) view returns (address[])',
])

const collectionABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
])

export const ViewNFTs: React.FC = () => {
  const { address } = useAccount()
  const [collections, setCollections] = useState<`0x${string}`[]>([])
  const [nfts, setNfts] = useState<{ [key: string]: any[] }>({})

  const { data: userCollections } = useReadContract({
    address: NFT_FACTORY_ADDRESS,
    abi: factoryABI,
    functionName: 'getUserCollections',
    args: [address ?? '0x0'],
  })

  useEffect(() => {
    if (userCollections) {
      setCollections(userCollections as `0x${string}`[])
    }
  }, [userCollections])

  const { data: collectionsData } = useReadContracts({
    contracts: collections.flatMap((collection) => [
      { address: collection, abi: collectionABI, functionName: 'name' },
      { address: collection, abi: collectionABI, functionName: 'symbol' },
      { address: collection, abi: collectionABI, functionName: 'balanceOf', args: [address ?? '0x0'] },
    ]),
  })

  useEffect(() => {
    if (collectionsData) {
      const newNfts: { [key: string]: any[] } = {}
      for (let i = 0; i < collectionsData.length; i += 3) {
        const collectionAddress = collections[i / 3]
        newNfts[collectionAddress] = []
        for (let j = 0; j < Number(collectionsData[i + 2].result); j++) {
          newNfts[collectionAddress].push({
            name: collectionsData[i].result,
            symbol: collectionsData[i + 1].result,
            tokenId: j,
          })
        }
      }
      setNfts(newNfts)
    }
  }, [collectionsData, collections])

  return (
    <div>
      <h2>Your NFT Collections</h2>
      {Object.entries(nfts).map(([collectionAddress, collectionNfts]) => (
        <div key={collectionAddress}>
          <h3>{collectionNfts[0]?.name} ({collectionNfts[0]?.symbol})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {collectionNfts.map((nft) => (
              <div key={nft.tokenId} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
                <p>Token ID: {nft.tokenId}</p>
                {/* You can add an image here once you implement IPFS metadata fetching */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ViewNFTs
