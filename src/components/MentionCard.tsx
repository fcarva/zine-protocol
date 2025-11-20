"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mention } from "@/data/mockMentions";
import { ArrowUpRight } from "lucide-react";

interface MentionCardProps {
    mention: Mention;
}

export function MentionCard({ mention }: MentionCardProps) {
    return (
        <Link href={`/read/${mention.slug}`} className="block group">
            <article className="border-b border-flexoki-tx/10 py-8 group-hover:bg-flexoki-bg-200/50 transition-colors -mx-4 px-4 rounded-sm">
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-3">
                    <span className="font-mono text-xs text-flexoki-red uppercase tracking-wider">
                        {mention.category}
                    </span>
                    <time className="font-mono text-xs text-flexoki-tx-200">
                        {mention.date}
                    </time>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl font-bold text-flexoki-tx mb-3 group-hover:text-flexoki-red transition-colors">
                    {mention.title}
                </h2>

                <p className="font-serif text-lg text-flexoki-tx-200 leading-relaxed max-w-2xl mb-4">
                    {mention.excerpt}
                </p>

                <div className="flex items-center gap-2 text-flexoki-tx text-sm font-mono uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                    <span>Read Dispatch</span>
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </article>
        </Link>
    );
}
