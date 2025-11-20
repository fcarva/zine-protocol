"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Loader2, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { usePay } from "@/hooks/usePay";

export function VendingMachine() {
    const { address, isConnected } = useAccount();
    const { pay, isPending, isSuccess, hash, error } = usePay();
    const [ethAmount, setEthAmount] = useState("");
    const [note, setNote] = useState("");

    // Simple estimation: 1000 tokens per ETH (adjust based on your Juicebox config)
    const calculateZineAmount = (eth: string): number => {
        const ethValue = parseFloat(eth) || 0;
        return ethValue * 1000; // 1000 $ZINE per 1 ETH
    };

    const zineAmount = calculateZineAmount(ethAmount);

    const handleMint = async () => {
        if (!address || !ethAmount) return;

        await pay(ethAmount, address, note || "Minting $ZINE");
    };

    const resetForm = () => {
        setEthAmount("");
        setNote("");
    };

    // Success state
    if (isSuccess && hash) {
        return (
            <div className="bg-zine-gray border-2 border-flexoki-green p-6 space-y-4">
                <div className="text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-flexoki-green mx-auto animate-bounce" />
                    <div>
                        <h3 className="font-mono text-lg font-bold text-flexoki-green mb-2">
                            SUCCESS!
                        </h3>
                        <p className="font-mono text-sm text-flexoki-bg/80">
                            Your $ZINE tokens are being minted
                        </p>
                    </div>

                    {/* Transaction Link */}
                    <a
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs text-flexoki-cyan hover:text-flexoki-green transition-colors"
                    >
                        View on Etherscan
                        <ExternalLink className="w-3 h-3" />
                    </a>

                    {/* Mint Again Button */}
                    <button
                        onClick={resetForm}
                        className="w-full py-3 font-mono text-sm uppercase tracking-wider bg-flexoki-green text-flexoki-tx border-2 border-flexoki-green hover:bg-flexoki-bg hover:text-flexoki-green transition-all"
                    >
                        Mint Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zine-gray border-2 border-flexoki-green/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-flexoki-tx/20 pb-3">
                <h2 className="font-mono text-sm uppercase tracking-wider text-flexoki-bg">
                    Token Vending Machine
                </h2>
                <Coins className="w-5 h-5 text-flexoki-green" />
            </div>

            {/* Error State */}
            {error && (
                <div className="p-3 bg-flexoki-red/10 border border-flexoki-red/30 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-flexoki-red mt-0.5 flex-shrink-0" />
                    <div className="font-mono text-xs text-flexoki-red">
                        {error.message || "Transaction failed. Please try again."}
                    </div>
                </div>
            )}

            {/* ETH Input */}
            <div className="space-y-2">
                <label className="font-mono text-xs text-flexoki-bg/60 uppercase">
                    Pay ETH
                </label>
                <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-flexoki-tx/10 border-2 border-flexoki-tx/20 px-4 py-3 font-mono text-2xl text-flexoki-bg placeholder:text-flexoki-bg/30 focus:border-flexoki-green focus:outline-none transition-colors"
                    disabled={!isConnected || isPending}
                />
            </div>

            {/* You Get Display */}
            {ethAmount && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-flexoki-green/10 border border-flexoki-green/30"
                >
                    <div className="font-mono text-xs text-flexoki-bg/60 uppercase mb-1">
                        You Get (Estimated)
                    </div>
                    <div className="font-mono text-3xl font-bold text-flexoki-green">
                        ~{zineAmount.toFixed(0)} $ZINE
                    </div>
                    <div className="font-mono text-xs text-flexoki-bg/50 mt-1">
                        Rate: 1000 $ZINE per ETH
                    </div>
                </motion.div>
            )}

            {/* Optional Note */}
            <div className="space-y-2">
                <label className="font-mono text-xs text-flexoki-bg/60 uppercase">
                    Leave a note (optional)
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Supporting the movement..."
                    rows={2}
                    maxLength={100}
                    className="w-full bg-flexoki-tx/10 border-2 border-flexoki-tx/20 px-3 py-2 font-mono text-sm text-flexoki-bg placeholder:text-flexoki-bg/30 focus:border-flexoki-green focus:outline-none transition-colors resize-none"
                    disabled={!isConnected || isPending}
                />
                {note && (
                    <div className="font-mono text-xs text-flexoki-bg/40 text-right">
                        {note.length}/100
                    </div>
                )}
            </div>

            {/* Mint Button */}
            <button
                onClick={handleMint}
                disabled={!isConnected || !ethAmount || parseFloat(ethAmount) <= 0 || isPending}
                className="w-full py-4 font-mono text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-flexoki-green text-flexoki-tx border-2 border-flexoki-green hover:bg-flexoki-bg hover:text-flexoki-green disabled:hover:bg-flexoki-green disabled:hover:text-flexoki-tx flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Minting...
                    </>
                ) : !isConnected ? (
                    "Connect Wallet to Mint"
                ) : (
                    "Mint $ZINE"
                )}
            </button>

            {/* Info Text */}
            <p className="font-mono text-xs text-flexoki-bg/50 text-center">
                {isPending
                    ? "Confirm the transaction in your wallet..."
                    : "Minting $ZINE adds ETH to the treasury and increases backing value"
                }
            </p>
        </div>
    );
}
