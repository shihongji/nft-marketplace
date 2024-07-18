import React, { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { sepolia } from '../wagmi'

// Ensure this is a valid Ethereum address
const FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890' as `0x${string}`

const factoryABI = parseAbi([
  'function createCollection(string name, string symbol) public returns (address)',
])
const CreateCollection: React.FC = () => {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')

  const { writeContract, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    writeContract({
      address: FACTORY_ADDRESS,
      abi: factoryABI,
      functionName: 'createCollection',
      args: [name, symbol],
      chainId: sepolia.id,
    })
  }

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
      <button
        type="submit"
        disabled={isConfirming}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isConfirming ? 'Creating...' : 'Create Collection'}
      </button>
      {isSuccess && <p className="text-green-600">Collection created successfully!</p>}
    </form>
  )
}

export default CreateCollection
