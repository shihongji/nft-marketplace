import React, { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { sepolia } from '../wagmi'

const FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890' as `0x${string}`

const factoryABI = parseAbi([
  'function createCollection(string name, string symbol) public returns (address)',
])

const CreateCollection: React.FC = () => {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [isMocking, setIsMocking] = useState(false)
  const [mockSuccess, setMockSuccess] = useState(false)

  const { writeContract, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isMocking) {
      // Simulate contract interaction
      setMockSuccess(false)
      setTimeout(() => {
        setMockSuccess(true)
      }, 2000)
    } else {
      writeContract({
        address: FACTORY_ADDRESS,
        abi: factoryABI,
        functionName: 'createCollection',
        args: [name, symbol],
        chainId: sepolia.id,
      })
    }
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
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isMocking}
            onChange={() => setIsMocking(!isMocking)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Mock contract interaction (for testing)</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={isConfirming || (isMocking && mockSuccess)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isConfirming || (isMocking && !mockSuccess) ? 'Creating...' : 'Create Collection'}
      </button>
      {(isSuccess || mockSuccess) && (
        <p className="text-green-600">Collection created successfully!</p>
      )}
    </form>
  )
}

export default CreateCollection
