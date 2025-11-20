export type TransactionType = "mint" | "purchase" | "burn";

export interface Transaction {
    id: string;
    type: TransactionType;
    user: string;
    userAddress: string;
    amount: number;
    token: "ETH" | "ZINE";
    zineId?: number;
    zineTitle?: string;
    timestamp: number;
    txHash: string;
    note?: string;
}

// Fixed base time for deterministic rendering (2025-11-19 12:00:00 UTC)
const BASE_TIME = 1763553600000;

// Helper to generate deterministic timestamps
const getTimestamp = (hoursAgo: number) => {
    return BASE_TIME - hoursAgo * 60 * 60 * 1000;
};

export const mockTransactions: Transaction[] = [
    {
        id: "tx-1",
        type: "purchase",
        user: "collector.eth",
        userAddress: "0x7890123456789012345678901234567890123456",
        amount: 50,
        token: "ZINE",
        zineId: 3,
        zineTitle: "Digital Flesh",
        timestamp: getTimestamp(2),
        txHash: "0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    },
    {
        id: "tx-2",
        type: "mint",
        user: "0x5d09...45df",
        userAddress: "0x5d0912345678901234567890123456789012345df",
        amount: 100,
        token: "ZINE",
        timestamp: getTimestamp(4),
        txHash: "0x1234abcd567890efabcd1234567890efabcd1234567890efabcd1234567890ef",
        note: "Supporting the movement 🔥",
    },
    {
        id: "tx-3",
        type: "purchase",
        user: "art.enthusiast.eth",
        userAddress: "0x6789012345678901234567890123456789012345",
        amount: 50,
        token: "ZINE",
        zineId: 2,
        zineTitle: "Concrete Dreams",
        timestamp: getTimestamp(5),
        txHash: "0xef123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde",
    },
    {
        id: "tx-4",
        type: "mint",
        user: "patron.eth",
        userAddress: "0x9012345678901234567890123456789012345678",
        amount: 250,
        token: "ZINE",
        timestamp: getTimestamp(12),
        txHash: "0xbcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789a",
    },
    {
        id: "tx-5",
        type: "purchase",
        user: "0xa3f2...8c1d",
        userAddress: "0xa3f23456789012345678901234567890123458c1d",
        amount: 75,
        token: "ZINE",
        zineId: 3,
        zineTitle: "Digital Flesh",
        timestamp: getTimestamp(14),
        txHash: "0x56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234",
    },
    {
        id: "tx-6",
        type: "mint",
        user: "builder.eth",
        userAddress: "0xbcde345678901234567890123456789012345678",
        amount: 50,
        token: "ZINE",
        timestamp: getTimestamp(24),
        txHash: "0xcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab",
        note: "First mint!",
    },
    {
        id: "tx-7",
        type: "purchase",
        user: "photo.lover.eth",
        userAddress: "0xcdef456789012345678901234567890123456789",
        amount: 50,
        token: "ZINE",
        zineId: 1,
        zineTitle: "The Birth",
        timestamp: getTimestamp(26),
        txHash: "0xdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abc",
    },
    {
        id: "tx-8",
        type: "mint",
        user: "0x7f3a...2b4c",
        userAddress: "0x7f3a56789012345678901234567890123452b4c",
        amount: 500,
        token: "ZINE",
        timestamp: getTimestamp(48),
        txHash: "0xef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd",
    },
    {
        id: "tx-9",
        type: "purchase",
        user: "underground.eth",
        userAddress: "0xdef5678901234567890123456789012345678901",
        amount: 60,
        token: "ZINE",
        zineId: 4,
        zineTitle: "Silent Frequencies",
        timestamp: getTimestamp(50),
        txHash: "0xf0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde",
    },
    {
        id: "tx-10",
        type: "mint",
        user: "early.adopter.eth",
        userAddress: "0xef67890123456789012345678901234567890123",
        amount: 1000,
        token: "ZINE",
        timestamp: getTimestamp(72),
        txHash: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        note: "All in on $ZINE",
    },
    {
        id: "tx-11",
        type: "purchase",
        user: "zine.collector.eth",
        userAddress: "0xf678901234567890123456789012345678901234",
        amount: 50,
        token: "ZINE",
        zineId: 5,
        zineTitle: "Analog Revolution",
        timestamp: getTimestamp(75),
        txHash: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    },
    {
        id: "tx-12",
        type: "mint",
        user: "0x4b2d...9e3f",
        userAddress: "0x4b2d67890123456789012345678901234569e3f",
        amount: 75,
        token: "ZINE",
        timestamp: getTimestamp(96),
        txHash: "0x23456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    },
    {
        id: "tx-13",
        type: "purchase",
        user: "curator.eth",
        userAddress: "0x0789012345678901234567890123456789012345",
        amount: 50,
        token: "ZINE",
        zineId: 2,
        zineTitle: "Concrete Dreams",
        timestamp: getTimestamp(100),
        txHash: "0x3456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012",
    },
    {
        id: "tx-14",
        type: "mint",
        user: "web3.native.eth",
        userAddress: "0x1890123456789012345678901234567890123456",
        amount: 200,
        token: "ZINE",
        timestamp: getTimestamp(120),
        txHash: "0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
        note: "Let's go! 🚀",
    },
    {
        id: "tx-15",
        type: "purchase",
        user: "0x9c5e...3a1f",
        userAddress: "0x9c5e12345678901234567890123456789013a1f",
        amount: 50,
        token: "ZINE",
        zineId: 1,
        zineTitle: "The Birth",
        timestamp: getTimestamp(125),
        txHash: "0x56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234",
    },
];

// Sort by timestamp descending (newest first)
mockTransactions.sort((a, b) => b.timestamp - a.timestamp);
