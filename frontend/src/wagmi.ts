import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'NFT-marketplace',
  projectId: '5d9583c04926c75b3cc048291bac62c7', // Get this from WalletConnect
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})

export { sepolia }
