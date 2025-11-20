"use client";

import { motion } from "framer-motion";

export function Marquee() {
    return (
        <div className="relative w-full overflow-hidden bg-flexoki-red py-4 border-y-4 border-flexoki-tx">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 mx-4">
                        <span className="font-mono text-2xl font-bold text-flexoki-bg uppercase tracking-wider">
              /// DECENTRALIZED PUBLISHING IS HERE ///
                        </span>
                        <span className="font-serif text-2xl italic text-flexoki-bg">
                            Mint. Print. Burn.
                        </span>
                        <span className="font-mono text-2xl font-bold text-flexoki-bg uppercase tracking-wider">
              /// JOIN THE PROTOCOL ///
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
