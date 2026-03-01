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

