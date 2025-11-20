"use client";

import { motion } from "framer-motion";
import { Upload, PenTool, Printer, Globe } from "lucide-react";

export function FactoryDiagram() {
    const steps = [
        {
            id: "input",
            title: "Input",
            icon: <Upload className="w-6 h-6" />,
            desc: "Creators upload source files (InDesign, PDF) to Arweave Vault.",
        },
        {
            id: "curation",
            title: "Curation",
            icon: <PenTool className="w-6 h-6" />,
            desc: "Community votes on the next print cycle using $ZINE.",
        },
        {
            id: "print",
            title: "Print Node",
            icon: <Printer className="w-6 h-6" />,
            desc: "Local nodes receive orders and print on-demand.",
        },
        {
            id: "output",
            title: "Output",
            icon: <Globe className="w-6 h-6" />,
            desc: "Global distribution with local logistics.",
        },
    ];

    return (
        <section className="py-24 px-4 bg-zinc-900 border-b border-flexoki-bg-800 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="font-serif text-4xl md:text-5xl text-flexoki-bg mb-4">The Factory</h2>
                    <p className="font-mono text-flexoki-green uppercase tracking-widest text-sm">
                        Production Pipeline v1.0
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-flexoki-bg-800 -translate-y-1/2 hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="group relative bg-zinc-900 p-6 border border-flexoki-bg-800 hover:border-flexoki-green transition-colors"
                            >
                                <div className="w-12 h-12 bg-flexoki-bg-800 rounded-full flex items-center justify-center text-flexoki-bg mb-4 group-hover:bg-flexoki-green group-hover:text-zinc-900 transition-colors mx-auto md:mx-0 relative z-20">
                                    {step.icon}
                                </div>
                                <h3 className="font-serif text-xl text-flexoki-bg mb-2 text-center md:text-left">
                                    {step.title}
                                </h3>
                                <p className="font-mono text-xs text-flexoki-tx-200 leading-relaxed text-center md:text-left">
                                    {step.desc}
                                </p>

                                {/* Step Number */}
                                <div className="absolute top-4 right-4 font-mono text-4xl text-flexoki-bg-800 font-bold opacity-50 select-none">
                                    0{i + 1}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
