"use client";

import { motion } from "framer-motion";
import { MOCK_ZINES } from "@/data/mockZines";

export function CollageHero() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-flexoki-bg flex items-center justify-center">
            {/* Background Grid (Subtle) */}
            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(#100F0F 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* Massive Typography Layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mix-blend-difference text-flexoki-bg">
                <h1 className="text-massive text-center leading-none">
                    ZINE<br />PROTOCOL
                </h1>
            </div>

            {/* Scattered Covers Layer */}
            <div className="absolute inset-0 z-0">
                {MOCK_ZINES.map((zine, index) => {
                    // Deterministic random positions based on index
                    const randomX = (index * 20) % 80 + 10; // 10% to 90%
                    const randomY = (index * 30) % 70 + 15; // 15% to 85%
                    const randomRotate = (index * 45) % 30 - 15; // -15deg to 15deg

                    return (
                        <motion.div
                            key={zine.id}
                            initial={{ opacity: 0, scale: 0.8, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
                            className="absolute w-48 md:w-64 aspect-[3/4] shadow-paper bg-white p-2 transform hover:z-20 hover:scale-110 transition-all duration-300 cursor-pointer"
                            style={{
                                left: `${randomX}%`,
                                top: `${randomY}%`,
                                rotate: `${randomRotate}deg`,
                            }}
                        >
                            <div className="w-full h-full bg-zine-gray overflow-hidden relative group">
                                <img
                                    src={zine.coverImage}
                                    alt={zine.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-flexoki-red text-flexoki-bg p-1 font-mono text-xs uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    Issue #{zine.issueNumber}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <span className="font-mono text-xs uppercase tracking-widest text-flexoki-tx">
                    Scroll for Chaos ↓
                </span>
            </div>
        </section>
    );
}
