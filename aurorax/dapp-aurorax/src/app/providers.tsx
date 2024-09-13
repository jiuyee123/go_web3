// app/providers.tsx
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const projectId = "1e71fdcad97bd3325fde8491f2894372"; // Get one from https://cloud.walletconnect.com/

const { wallets } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId,
});

const chains = [sepolia] as const;

const connectors = connectorsForWallets(wallets, {
  projectId,
  appName: "My RainbowKit App",
});

const config = createConfig({
  chains,
  transports: {
    [sepolia.id]: http(),
  },
  connectors,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
