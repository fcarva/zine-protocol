import { baseSepolia } from "wagmi/chains";

export const publicEnv = {
  baseSepoliaRpcUrl:
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS || "",
  revnetTerminalAddress: process.env.NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS || "",
  revnetAppUrl: process.env.NEXT_PUBLIC_REVNET_APP_URL || "https://app.revnet.eth.sucks",
  baseSepoliaChainId: baseSepolia.id,
};

export const serverEnv = {
  abacateApiKey: process.env.ABACATEPAY_API_KEY || "",
  abacateWebhookSecret: process.env.ABACATEPAY_WEBHOOK_SECRET || "",
  curatorWallets: (process.env.CURATOR_WALLETS || "")
    .split(",")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean),
};

