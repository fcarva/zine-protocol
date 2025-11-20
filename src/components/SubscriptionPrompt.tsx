"use client";

import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface SubscriptionPromptProps {
    children: React.ReactNode;
}

export function SubscriptionPrompt({ children }: SubscriptionPromptProps) {
    const { isConnected } = useAccount();

    // If connected, show content (mock logic for now)
    // In real implementation, we would check for $ZINE balance
    if (isConnected) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred Content Preview */}
            <div className="blur-sm select-none pointer-events-none h-96 overflow-hidden opacity-50">
                {children}
            </div>

            {/* Paywall Prompt */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-flexoki-bg border-2 border-flexoki-red p-8 max-w-md text-center shadow-[8px_8px_0px_0px_#AF3029]"
                >
                    <div className="flex justify-center mb-4 text-flexoki-red">
                        <Lock className="w-8 h-8" />
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-flexoki-red mb-4">
                        Members Only Content
                    </h3>

                    <p className="font-mono text-sm text-flexoki-tx mb-8 leading-relaxed">
                        This dispatch is reserved for $ZINE holders.
                        Support decentralized publishing to unlock the full archive.
                    </p>

                    <button
                        onClick={() => document.getElementById('connect-wallet-trigger')?.click()}
                        className="w-full bg-flexoki-red text-flexoki-bg px-6 py-3 font-mono uppercase tracking-wider hover:bg-flexoki-red/90 transition-colors"
                    >
                        Connect to Read
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
