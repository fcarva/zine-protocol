"use client";

import Link from "next/link";
import { Mention } from "@/data/mockMentions";
import { ArrowUpRight } from "lucide-react";

interface StickerCardProps {
    mention: Mention;
    rotation?: number;
}

export function StickerCard({ mention, rotation = 0 }: StickerCardProps) {
    return (
        <Link href={`/read/${mention.slug}`} className="block group">
            <article
                className="bg-flexoki-bg border-2 border-flexoki-tx p-6 shadow-paper transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:rotate-0"
                style={{ rotate: `${rotation}deg` }}
            >
                {/* "Tape" Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-flexoki-tx-50/50 rotate-1 backdrop-blur-sm" />

                <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs bg-flexoki-tx text-flexoki-bg px-2 py-1 uppercase">
                        {mention.category}
                    </span>
                    <span className="font-mono text-xs text-flexoki-tx-200">
                        {mention.date}
                    </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-flexoki-tx mb-3 leading-tight group-hover:text-flexoki-red transition-colors">
                    {mention.title}
                </h3>

                <p className="font-sans text-sm text-flexoki-tx-200 mb-4 line-clamp-3">
                    {mention.excerpt}
                </p>

                <div className="flex justify-end">
                    <ArrowUpRight className="w-5 h-5 text-flexoki-red" />
                </div>
            </article>
        </Link>
    );
}
