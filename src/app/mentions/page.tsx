"use client";

import { Header } from "@/components/Header";
import { MentionCard } from "@/components/MentionCard";
import { MOCK_MENTIONS } from "@/data/mockMentions";
import { motion } from "framer-motion";

export default function MentionsPage() {
    return (
        <div className="min-h-screen bg-flexoki-bg text-flexoki-tx">
            <Header />

            <main className="max-w-3xl mx-auto px-4 py-16 md:py-24">
                {/* Page Header */}
                <div className="mb-16 border-b-4 border-flexoki-tx pb-8">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-flexoki-tx mb-4">
                        Mentions
                    </h1>
                    <p className="font-mono text-sm md:text-base text-flexoki-tx-200 max-w-xl leading-relaxed">
                        Dispatches from the decentralized publishing underground.
                        Essays, protocol updates, and cultural critique.
                    </p>
                </div>

                {/* Mentions List */}
                <div className="space-y-4">
                    {MOCK_MENTIONS.map((mention, index) => (
                        <motion.div
                            key={mention.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <MentionCard mention={mention} />
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
