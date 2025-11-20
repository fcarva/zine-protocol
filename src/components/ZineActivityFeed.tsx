"use client";

import { motion } from "framer-motion";
import { ExternalLink, Coins, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityFeed } from "@/hooks/useActivityFeed";

interface ZineActivityFeedProps {
    maxItems?: number;
}

export function ZineActivityFeed({ maxItems = 15 }: ZineActivityFeedProps) {
    const { data: transactions, isLoading } = useActivityFeed(maxItems);

    const formatTimestamp = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="bg-zine-gray border-2 border-flexoki-tx/20 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-flexoki-tx/20">
                <h3 className="font-mono text-sm uppercase tracking-wider text-flexoki-bg">
                    Live Activity
                </h3>
                {!isLoading && transactions && transactions.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-flexoki-green rounded-full animate-pulse" />
                        <span className="font-mono text-xs text-flexoki-green">LIVE</span>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-flexoki-green animate-spin" />
                </div>
            ) : !transactions || transactions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="font-mono text-sm text-flexoki-bg/60">
                        No activity yet. Be the first to mint!
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {transactions.map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "p-3 border-l-2 bg-flexoki-tx/5 hover:bg-flexoki-tx/10 transition-colors border-flexoki-green"
                            )}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    {/* User */}
                                    <div className="font-mono text-xs text-flexoki-bg/80 truncate">
                                        {tx.user}
                                    </div>

                                    {/* Action */}
                                    <div className="font-mono text-sm text-flexoki-bg mt-1">
                                        <span className="flex items-center gap-1">
                                            <Coins className="w-3 h-3 text-flexoki-green" />
                                            <span>
                                                minted <span className="text-flexoki-green font-bold">{tx.amount} $ZINE</span>
                                            </span>
                                        </span>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-mono text-xs text-flexoki-bg/60">
                                            {formatTimestamp(tx.timestamp)}
                                        </span>
                                    </div>

                                    {/* Note (if exists) */}
                                    {tx.note && (
                                        <div className="mt-2 text-xs italic text-flexoki-bg/70 border-l-2 border-flexoki-bg/20 pl-2">
                                            "{tx.note}"
                                        </div>
                                    )}
                                </div>

                                {/* Etherscan Link */}
                                <a
                                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-flexoki-bg/60 hover:text-flexoki-green transition-colors"
                                    title="View on Etherscan"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 252, 240, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 252, 240, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 252, 240, 0.5);
        }
      `}</style>
        </div>
    );
}
