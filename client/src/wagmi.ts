import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    metaMask(), // browser wallet
    walletConnect({
      projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
      showQrModal: true, // ✅ DIRECT QR
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
