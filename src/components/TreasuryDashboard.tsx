"use client";

import { motion } from "framer-motion";
import { Wallet, Coins, Users, Package, Loader2, AlertCircle } from "lucide-react";
import { useProjectStats } from "@/hooks/useProjectStats";

export function TreasuryDashboard() {
    const { data: stats, isLoading, error } = useProjectStats();

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-zine-gray border-2 border-flexoki-tx/20 p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-flexoki-green animate-spin mx-auto" />
                    <p className="font-mono text-sm text-flexoki-bg/60">Loading treasury data...</p>
                </div>
            </div>
        );
    }

    // Error state or no data
    if (error) {
        return (
            <div className="bg-zine-gray border-2 border-flexoki-red/50 p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-flexoki-red mx-auto" />
                    <p className="font-mono text-sm text-flexoki-bg/80">Failed to load treasury data</p>
                    <p className="font-mono text-xs text-flexoki-bg/60">
                        {error?.message || "Please check your environment configuration"}
                    </p>
                </div>
            </div>
        );
    }

    // No data from subgraph - show empty state
    if (!stats || (stats.balance === 0 && stats.volume === 0 && stats.payments === 0)) {
        return (
            <div className="bg-zine-gray border-2 border-flexoki-tx/20 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-mono text-sm uppercase tracking-wider text-flexoki-bg border-b border-flexoki-tx/20 pb-2">
                        Treasury Stats
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-flexoki-yellow rounded-full animate-pulse" />
                        <span className="font-mono text-xs text-flexoki-yellow">INDEXING</span>
                    </div>
                </div>
                <div className="text-center py-12 space-y-3">
                    <Package className="w-12 h-12 text-flexoki-bg/30 mx-auto" />
                    <p className="font-mono text-sm text-flexoki-bg/60">
                        No treasury data yet
                    </p>
                    <p className="font-mono text-xs text-flexoki-bg/40">
                        The subgraph may still be indexing your project.<br />
                        Try minting some $ZINE tokens to get started!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zine-gray border-2 border-flexoki-tx/20 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-mono text-sm uppercase tracking-wider text-flexoki-bg border-b border-flexoki-tx/20 pb-2">
                    Treasury Stats
                </h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-flexoki-green rounded-full animate-pulse" />
                    <span className="font-mono text-xs text-flexoki-green">LIVE</span>
                </div>
            </div>

            {/* Primary Stats */}
            <div className="space-y-4">
                {/* ETH Balance */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2 text-flexoki-bg/60">
                        <Wallet className="w-4 h-4" />
                        <span className="font-mono text-xs uppercase">Total Balance</span>
                    </div>
                    <div className="font-mono text-4xl font-bold text-flexoki-green">
                        {stats.balance.toFixed(4)} ETH
                    </div>
                </motion.div>

                {/* Volume */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2 text-flexoki-bg/60">
                        <Coins className="w-4 h-4" />
                        <span className="font-mono text-xs uppercase">Total Volume</span>
                    </div>
                    <div className="font-mono text-4xl font-bold text-flexoki-bg">
                        {stats.volume.toFixed(4)} ETH
                    </div>
                </motion.div>

                {/* Backing Ratio */}
                {stats.backingRatio > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-3 bg-flexoki-cyan/10 border border-flexoki-cyan/30"
                    >
                        <div className="font-mono text-xs text-flexoki-bg/60 uppercase mb-1">
                            Backing Ratio
                        </div>
                        <div className="font-mono text-xl font-bold text-flexoki-cyan">
                            1 $ZINE ≈ {stats.backingRatio.toFixed(6)} ETH
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-flexoki-tx/20">
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-flexoki-bg/60">
                        <Users className="w-3 h-3" />
                        <span className="font-mono text-xs">Contributors</span>
                    </div>
                    <div className="font-mono text-2xl font-bold text-flexoki-bg">
                        {stats.contributors}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-flexoki-bg/60">
                        <Package className="w-3 h-3" />
                        <span className="font-mono text-xs">Payments</span>
                    </div>
                    <div className="font-mono text-2xl font-bold text-flexoki-bg">
                        {stats.payments}
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="pt-4 border-t border-flexoki-tx/20">
                <p className="font-mono text-xs text-flexoki-bg/50 italic">
                    Data from Juicebox V3 Sepolia • Updates every 30s
                </p>
            </div>
        </div>
    );
}
