import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import CreateCollection from '../components/MockCreateCollection'

const Home: React.FC = () => {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">NFT Marketplace</h1>
          <ConnectButton />
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold mb-4">Welcome to NFT Marketplace</h2>
            
            {isConnected ? (
              <div className="space-y-6">
                <p>Connected with {address}</p>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Create a New NFT Collection</h3>
                  <CreateCollection />
                </div>
              </div>
            ) : (
              <p>Please connect your wallet to continue</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
