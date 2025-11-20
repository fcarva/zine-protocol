"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ArticleLayoutProps {
    children: React.ReactNode;
    title: string;
    meta: React.ReactNode;
}

export function ArticleLayout({ children, title, meta }: ArticleLayoutProps) {
    return (
        <article className="min-h-screen bg-flexoki-bg text-flexoki-tx selection:bg-flexoki-red/20">
            {/* Minimal Header */}
            <header className="sticky top-0 z-40 bg-flexoki-bg/95 backdrop-blur-sm border-b border-flexoki-tx/10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/mentions"
                        className="group flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-flexoki-tx-200 hover:text-flexoki-red transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dispatches
                    </Link>

                    <Link href="/" className="font-serif font-bold text-lg text-flexoki-tx">
                        ZINE PROTOCOL
                    </Link>
                </div>
            </header>

            {/* Article Content */}
            <main className="max-w-[65ch] mx-auto px-4 py-16 md:py-24">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-flexoki-tx mb-6 leading-tight">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-wider text-flexoki-tx-200">
                        {meta}
                    </div>
                </motion.div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-editorial text-flexoki-tx-800 drop-cap"
                >
                    {children}
                </motion.div>

                {/* Footer / Signature */}
                <div className="mt-24 pt-12 border-t border-flexoki-tx/10 text-center">
                    <div className="w-8 h-8 bg-flexoki-tx text-flexoki-bg mx-auto flex items-center justify-center font-serif font-bold rounded-sm mb-4">
                        Z
                    </div>
                    <p className="font-mono text-xs text-flexoki-tx-200 uppercase tracking-widest">
                        End of Dispatch
                    </p>
                </div>
            </main>
        </article>
    );
}
