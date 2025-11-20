"use client";

import { motion } from "framer-motion";

export function Ticker() {
    const tickerContent = [
        "$ZINE PRICE: $0.42",
        "///",
        "VOLUME: 240 ETH",
        "///",
        "NEXT PRINT CYCLE: 14H 20M",
        "///",
        "LIVE FROM THE FACTORY",
        "///",
        "REVNET ID: 0x4A...184C",
        "///",
    ];

    return (
        <div className="w-full bg-flexoki-bg-900 text-neon-green border-b border-flexoki-bg-800 overflow-hidden py-2 font-mono text-xs uppercase tracking-widest z-50 relative">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                >
                    {[...tickerContent, ...tickerContent, ...tickerContent, ...tickerContent].map((item, i) => (
                        <span key={i} className={item === "///" ? "text-flexoki-tx-200" : "text-flexoki-green"}>
                            {item}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
