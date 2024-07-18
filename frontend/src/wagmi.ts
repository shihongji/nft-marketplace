import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})

export { sepolia }
