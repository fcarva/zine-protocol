"use client";

import { VendingMachine } from "@/components/VendingMachine";
import { BenefitsList } from "@/components/BenefitsList";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { mockTreasuryStats } from "@/data/mockTreasury";

export default function SupplyPage() {
    return (
        <main className="min-h-screen bg-flexoki-bg overflow-x-hidden flex flex-col">
            <Header />

            <div className="flex-grow relative py-20 px-4">
                {/* Chaos Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-flexoki-green/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 right-20 w-96 h-96 bg-flexoki-red/10 rounded-full blur-3xl" />

                    {/* Floating Text */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-40 left-[10%] font-serif text-9xl text-zine-dark/5 font-bold select-none"
                    >
                        SUPPLY
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 30, 0], rotate: [0, -3, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-20 right-[5%] font-serif text-[12rem] text-zine-dark/5 font-bold select-none leading-none"
                    >
                        MINT
                    </motion.div>
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Vending Machine (The Action) */}
                        <div className="order-2 lg:order-1 relative">
                            {/* Arrow pointing to machine */}
                            <div className="absolute -top-16 -right-10 md:-right-20 z-20 hidden md:block">
                                <svg width="120" height="120" viewBox="0 0 100 100" className="text-flexoki-red transform rotate-12">
                                    <path d="M10,10 Q50,50 20,90" fill="none" stroke="currentColor" strokeWidth="4" markerEnd="url(#arrowhead)" />
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                        </marker>
                                    </defs>
                                    <text x="40" y="30" className="font-black text-sm tracking-widest fill-currentColor rotate-12" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>GET $ZINE</text>
                                </svg>
                            </div>

                            <div className="transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                <VendingMachine />
                            </div>
                        </div>

                        {/* Right Column: Context & Benefits (The Chaos) */}
                        <div className="order-1 lg:order-2 space-y-12">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-zine-dark/5 skew-y-2 rounded-lg -z-10" />
                                <h1 className="font-serif text-6xl md:text-8xl font-black text-zine-dark leading-[0.9] tracking-tighter mb-6">
                                    FUEL THE <br />
                                    <span className="text-flexoki-red italic">PROTOCOL</span>
                                </h1>
                                <p className="font-mono text-lg text-zine-dark/80 max-w-md leading-relaxed">
                                    $ZINE is not just a token. It's your ticket to the printing press.
                                    Mint to support independent publishing and earn your stake in the network.
                                </p>
                            </div>

                            <div className="relative pl-8 md:pl-16">
                                <div className="absolute top-0 left-0 md:left-8 -rotate-6 z-20">
                                    <div className="bg-flexoki-yellow text-zine-dark px-4 py-1 font-mono text-xs font-bold border border-zine-dark shadow-sm">
                                        MEMBERSHIP
                                    </div>
                                </div>
                                <BenefitsList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
