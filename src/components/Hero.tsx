"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative h-[90vh] overflow-hidden flex flex-col items-center justify-center border-b border-flexoki-bg-800">
            {/* Background Parallax Element */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
                <div className="w-[60vw] h-[80vh] bg-gradient-to-b from-flexoki-bg-800 to-zine-dark opacity-50 blur-3xl rounded-full" />
                {/* Abstract "Zine" shape */}
                <div className="absolute w-[40vw] h-[60vh] border border-flexoki-tx-200/20 rotate-12" />
                <div className="absolute w-[40vw] h-[60vh] border border-flexoki-tx-200/20 -rotate-6" />
            </motion.div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-serif text-6xl md:text-9xl tracking-tighter text-flexoki-bg leading-[0.9] mb-6"
                >
                    ZINE <br />
                    <span className="text-flexoki-tx-200 italic">PROTOCOL</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-mono text-flexoki-green text-sm md:text-base uppercase tracking-widest max-w-lg mx-auto"
                >
                    Decentralized Publishing House <br />
                    Global Files • Local Ink • Perpetual Royalties
                </motion.p>
            </div>

            <div className="absolute bottom-8 left-0 w-full flex justify-between px-8 font-mono text-xs text-flexoki-tx-200 uppercase">
                <span>Est. 2025</span>
                <span>Scroll for Manifesto</span>
                <span>Vol. 01</span>
            </div>
        </section>
    );
}
