
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Package } from "lucide-react";
import { Zine } from "@/data/mockZines";
import { cn } from "@/lib/utils";

interface ZineCardProps {
    zine: Zine;
    onBuyClick: (zine: Zine) => void;
}

export function ZineCard({ zine, onBuyClick }: ZineCardProps) {
    const isSoldOut = zine.soldCount >= zine.supply;
    const percentSold = (zine.soldCount / zine.supply) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={cn(
                "group relative bg-flexoki-bg border-2 border-flexoki-tx overflow-hidden",
                "transition-all duration-300",
                isSoldOut && "grayscale opacity-60"
            )}
        >
            {/* Cover Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-flexoki-bg-200">
                <Image
                    src={zine.coverImage}
                    alt={`${zine.title} - Issue #${zine.issueNumber}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 bg-flexoki-tx/80 flex items-center justify-center">
                        <span className="font-mono text-flexoki-bg text-2xl tracking-wider">
                            SOLD OUT
                        </span>
                    </div>
                )}

                {/* Issue Number Badge */}
                <div className="absolute top-3 right-3 bg-flexoki-tx text-flexoki-bg px-3 py-1 font-mono text-xs">
                    #{zine.issueNumber.toString().padStart(2, "0")}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-serif text-2xl font-bold text-flexoki-tx leading-tight">
                    {zine.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-mono text-flexoki-tx/60">
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{zine.collectors} collectors</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{zine.supply - zine.soldCount}/{zine.supply} left</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-flexoki-bg-200">
                    <div
                        className="h-full bg-flexoki-green transition-all duration-300"
                        style={{ width: `${percentSold}%` }}
                    />
                </div>

                {/* Pricing */}
                <div className="space-y-1">
                    <div className="font-mono text-3xl font-bold text-flexoki-tx">
                        {zine.priceInZine} $ZINE
                    </div>
                    <div className="font-mono text-sm text-flexoki-tx/60">
                        ≈ {zine.priceInEth} ETH
                    </div>
                </div>

                {/* Print Node Teaser */}
                <div className="pt-2 border-t border-flexoki-tx/10">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-flexoki-tx/60">
                            Printable in:
                        </span>
                        <div className="flex gap-1 text-base">
                            🇧🇷 🇺🇸 🇩🇪
                        </div>
                    </div>
                </div>

                {/* Buy Button */}
                <button
                    onClick={() => onBuyClick(zine)}
                    disabled={isSoldOut}
                    className={cn(
                        "w-full py-3 font-mono text-sm uppercase tracking-wider transition-colors",
                        "border-2",
                        isSoldOut
                            ? "bg-flexoki-bg-200 text-flexoki-tx/40 border-flexoki-tx/20 cursor-not-allowed"
                            : "bg-flexoki-green text-flexoki-bg border-flexoki-green hover:bg-flexoki-tx hover:border-flexoki-tx hover:text-flexoki-bg"
                    )}
                >
                    {isSoldOut ? "Sold Out" : "Buy with $ZINE"}
                </button>
            </div>
        </motion.div>
    );
}
