import { type Address, type PublicClient } from "viem";

export const revnetTerminalAbi = [
  {
    type: "function",
    name: "pay",
    stateMutability: "payable",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "beneficiary", type: "address" },
      { name: "minReturnedTokens", type: "uint256" },
      { name: "memo", type: "string" },
      { name: "metadata", type: "bytes" },
    ],
    outputs: [{ name: "beneficiaryTokenCount", type: "uint256" }],
  },
] as const;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const revnetDirectoryAbi = [
  {
    type: "function",
    name: "primaryTerminalOf",
    stateMutability: "view",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
    ],
    outputs: [{ name: "terminal", type: "address" }],
  },
] as const;

// Revnet directories observed in Juice SDK deployments (v5 first, then v4 fallback).
const baseSepoliaDirectories: Address[] = [
  "0x0061e516886a0540f63157f112c0588ee0651dcf",
  "0x0bc9f153dee4d3d474ce0903775b9b2aaae9aa41",
];

export async function resolveRevnetTerminalAddress(params: {
  publicClient: PublicClient;
  projectId: number;
  tokenAddress: Address;
  fallbackTerminalAddress?: Address;
}): Promise<Address | null> {
  const { publicClient, projectId, tokenAddress, fallbackTerminalAddress } = params;

  for (const directoryAddress of baseSepoliaDirectories) {
    try {
      const terminal = await publicClient.readContract({
        address: directoryAddress,
        abi: revnetDirectoryAbi,
        functionName: "primaryTerminalOf",
        args: [BigInt(projectId), tokenAddress],
      });

      if (terminal.toLowerCase() !== ZERO_ADDRESS) {
        return terminal;
      }
    } catch {
      // Try next directory fallback.
    }
  }

  if (fallbackTerminalAddress && fallbackTerminalAddress.toLowerCase() !== ZERO_ADDRESS) {
    return fallbackTerminalAddress;
  }

  return null;
}

