"use client";

import { type ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { CartProvider } from "@/components/cart-provider";
import { publicEnv } from "@/lib/env";

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  const config = useMemo(
    () =>
      createConfig({
        chains: [baseSepolia],
        connectors: [injected()],
        transports: {
          [baseSepolia.id]: http(publicEnv.baseSepoliaRpcUrl),
        },
      }),
    [],
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>{children}</CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

