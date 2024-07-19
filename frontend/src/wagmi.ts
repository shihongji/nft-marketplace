import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
const INFURA_API_KEY = "82a578dbf80b4b71b4289e6d907e7612";
export const config = getDefaultConfig({
  appName: "NFT-marketplace",
  projectId: "5d9583c04926c75b3cc048291bac62c7", // Get this from WalletConnect
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
  },
});

export { sepolia };

