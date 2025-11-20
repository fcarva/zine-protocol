export interface TreasuryStats {
    totalEthBalance: number;
    totalZineSupply: number;
    backingRatio: number; // ETH per ZINE
    totalOwners: number;
    totalZinesSold: number;
    revenueSplits: {
        treasury: number;
        operational: number;
        artists: number;
    };
}

export const mockTreasuryStats: TreasuryStats = {
    totalEthBalance: 12.45,
    totalZineSupply: 2475,
    backingRatio: 0.00503,
    totalOwners: 89,
    totalZinesSold: 394,
    revenueSplits: {
        treasury: 60, // 60%
        operational: 25, // 25% (printing, shipping, infrastructure)
        artists: 15, // 15% (creator royalties)
    },
};
