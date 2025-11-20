"use client";

import { motion } from "framer-motion";

export function Manifesto() {
    return (
        <section className="py-24 px-4 md:px-8 border-b border-flexoki-bg-800 bg-flexoki-bg-800 text-flexoki-bg">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="font-serif text-4xl md:text-5xl leading-tight">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        The Old World is <span className="text-flexoki-red italic">Broken</span>.
                    </motion.h2>
                    <p className="font-mono text-sm text-flexoki-tx-200 uppercase tracking-widest mb-4">
                        Problem
                    </p>
                    <ul className="space-y-4 text-lg text-flexoki-tx-50">
                        <li className="flex items-start gap-4">
                            <span className="text-flexoki-red">×</span>
                            <span>Gatekeepers control culture.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-flexoki-red">×</span>
                            <span>Printing costs kill creativity.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-flexoki-red">×</span>
                            <span>Distribution is a logistics nightmare.</span>
                        </li>
                    </ul>
                </div>

                <div className="font-serif text-4xl md:text-5xl leading-tight md:pt-32">
                    <motion.h2
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-8 text-right"
                    >
                        The Protocol is <span className="text-neon-green italic">Liberation</span>.
                    </motion.h2>
                    <p className="font-mono text-sm text-flexoki-green uppercase tracking-widest mb-4 text-right">
                        Solution
                    </p>
                    <ul className="space-y-4 text-lg text-flexoki-bg text-right">
                        <li className="flex items-center justify-end gap-4">
                            <span>Community curates value.</span>
                            <span className="text-flexoki-green">✓</span>
                        </li>
                        <li className="flex items-center justify-end gap-4">
                            <span>Treasury funds production.</span>
                            <span className="text-flexoki-green">✓</span>
                        </li>
                        <li className="flex items-center justify-end gap-4">
                            <span>Print Nodes distribute globally.</span>
                            <span className="text-flexoki-green">✓</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
