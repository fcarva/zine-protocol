import { baseSepolia } from "wagmi/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const DEFAULT_BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const DEFAULT_BASE_SEPOLIA_REVNET_TERMINAL = "0xdb9644369c79c3633cde70d2df50d827d7dc7dbc";

function cleanEnvValue(value: string | undefined, fallback = ""): string {
  return (value ?? fallback)
    .replace(/\\r|\\n/g, "")
    .replace(/[\r\n]/g, "")
    .trim();
}

function cleanAddress(value: string | undefined): `0x${string}` | "" {
  const cleaned = cleanEnvValue(value);
  if (!cleaned) return "";
  if (!/^0x[a-fA-F0-9]{40}$/.test(cleaned)) return "";
  if (cleaned.toLowerCase() === ZERO_ADDRESS) return "";
  return cleaned as `0x${string}`;
}

export const publicEnv = {
  baseSepoliaRpcUrl:
    cleanEnvValue(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL) || "https://sepolia.base.org",
  walletConnectProjectId: cleanEnvValue(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID),
  usdcAddress:
    cleanAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS) ||
    (DEFAULT_BASE_SEPOLIA_USDC as `0x${string}`),
  revnetTerminalAddress:
    cleanAddress(process.env.NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS) ||
    (DEFAULT_BASE_SEPOLIA_REVNET_TERMINAL as `0x${string}`),
  revnetAppUrl:
    cleanEnvValue(process.env.NEXT_PUBLIC_REVNET_APP_URL) || "https://app.revnet.eth.sucks",
  baseSepoliaChainId: baseSepolia.id,
};

export const serverEnv = {
  abacateApiKey: cleanEnvValue(process.env.ABACATEPAY_API_KEY),
  abacateWebhookSecret: cleanEnvValue(process.env.ABACATEPAY_WEBHOOK_SECRET),
  curatorWallets: cleanEnvValue(process.env.CURATOR_WALLETS)
    .split(",")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean),
};

export const databaseEnv = {
  url: cleanEnvValue(process.env.DATABASE_URL),
};

export function getWeb3ConfigErrorMessage(): string | null {
  const rawUsdcAddress = cleanEnvValue(process.env.NEXT_PUBLIC_USDC_ADDRESS);
  if (rawUsdcAddress && !cleanAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS)) {
    return "Config invalida: NEXT_PUBLIC_USDC_ADDRESS invalido. Fallback padrao ativo.";
  }

  const rawTerminalAddress = cleanEnvValue(process.env.NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS);
  if (rawTerminalAddress && !cleanAddress(process.env.NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS)) {
    return "Config invalida: NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS invalido. Fallback padrao ativo.";
  }

  return null;
}

