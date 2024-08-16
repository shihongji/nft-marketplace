import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Routes, Route, Link } from 'react-router-dom'
import CreateCollection from '../components/CreateCollection'
import ViewCollections from '../components/ViewCollections'
import ViewNFTs from '../components/ViewNFTs'  // Assuming you have this component

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
                <nav>
                  <ul className="flex space-x-4">
                    <li><Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
                    <li><Link to="/create" className="text-blue-600 hover:text-blue-800">Create Collection</Link></li>
                    <li><Link to="/view" className="text-blue-600 hover:text-blue-800">View Collections</Link></li>
                    <li><Link to="/nfts" className="text-blue-600 hover:text-blue-800">View NFTs</Link></li>
                  </ul>
                </nav>
                <Routes>
                  <Route path="/" element={
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Welcome to your NFT Dashboard</h3>
                      {/* Add some welcome content or summary here */}
                    </div>
                  } />
                  <Route path="/create" element={
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Create a New NFT Collection</h3>
                      <CreateCollection />
                    </div>
                  } />
                  <Route path="/view" element={<ViewCollections />} />
                  <Route path="/nfts" element={<ViewNFTs />} />
                </Routes>
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
