export const JB_TOKEN_ETH = '0x000000000000000000000000000000000000EEEe' as const;

// Juicebox V3 ETH Payment Terminal ABI (Minimal - only pay function)
export const JB_ETH_PAYMENT_TERMINAL_ABI = [
    {
        inputs: [
            { name: '_projectId', type: 'uint256' },
            { name: '_amount', type: 'uint256' },
            { name: '_token', type: 'address' },
            { name: '_beneficiary', type: 'address' },
            { name: '_minReturnedTokens', type: 'uint256' },
            { name: '_preferClaimedTokens', type: 'bool' },
            { name: '_memo', type: 'string' },
            { name: '_metadata', type: 'bytes' },
        ],
        name: 'pay',
        outputs: [{ name: 'fundingCycleConfiguration', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function',
    },
] as const;

// Sepolia Addresses - JBETHPaymentTerminal3_1_2 on Sepolia
export const SEPOLIA_CONTRACTS = {
    JB_ETH_PAYMENT_TERMINAL: '0x55d4dfb578daA4d60380995ffF7a706471d7c719' as const,
} as const;

// Get contract address from env or fallback to default
export function getTerminalAddress(): `0x${string}` {
    return (process.env.NEXT_PUBLIC_JB_ETH_TERMINAL_ADDRESS || SEPOLIA_CONTRACTS.JB_ETH_PAYMENT_TERMINAL) as `0x${string}`;
}

export function getProjectId(): bigint {
    const id = process.env.NEXT_PUBLIC_JB_PROJECT_ID;
    if (!id) {
        throw new Error('NEXT_PUBLIC_JB_PROJECT_ID is not set in environment variables');
    }
    return BigInt(id);
}
