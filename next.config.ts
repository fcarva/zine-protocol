import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi', '@walletconnect/ethereum-provider', '@walletconnect/universal-provider'],
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
