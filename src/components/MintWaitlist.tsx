"use client";

import { motion } from "framer-motion";

export function MintWaitlist() {
    return (
        <section className="py-24 px-4 border-b border-flexoki-bg-800 bg-flexoki-bg text-flexoki-tx">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="border-2 border-dashed border-flexoki-bg-800 p-8 md:p-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 bg-flexoki-red text-white px-4 py-1 font-mono text-xs uppercase tracking-widest transform -rotate-45 -translate-x-8 translate-y-4">
                        Closed
                    </div>

                    <h2 className="font-serif text-4xl md:text-6xl mb-6">
                        Genesis Issue <span className="italic text-flexoki-tx-200">#001</span>
                    </h2>

                    <p className="font-mono text-sm md:text-base text-flexoki-tx-200 mb-12 max-w-lg mx-auto">
                        The first decentralized print run. Limited to 500 copies.
                        Back the project to secure your physical copy and $ZINE allocation.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <input
                            type="email"
                            placeholder="ENTER_EMAIL_ADDRESS"
                            className="bg-transparent border border-flexoki-bg-800 px-6 py-3 font-mono text-sm w-full md:w-80 focus:outline-none focus:border-flexoki-green transition-colors placeholder:text-flexoki-tx-200/50"
                            disabled
                        />
                        <button
                            disabled
                            className="bg-flexoki-bg-800 text-flexoki-bg px-8 py-3 font-mono text-sm uppercase tracking-widest hover:bg-flexoki-green hover:text-flexoki-bg-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Join Waitlist
                        </button>
                    </div>

                    <p className="mt-6 font-mono text-xs text-flexoki-tx-200 uppercase">
                        Minting Begins Q4 2025
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
