"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/ui/Ticker";
import { ZineCard } from "@/components/ZineCard";
import { ZineActivityFeed } from "@/components/ZineActivityFeed";
import { TreasuryDashboard } from "@/components/TreasuryDashboard";
import { VendingMachine } from "@/components/VendingMachine";
import { VendingMachineFAB } from "@/components/VendingMachineFAB";
import { BuyZineModal } from "@/components/BuyZineModal";
import { MOCK_ZINES, Zine } from "@/data/mockZines";
import { mockTransactions } from "@/data/mockTransactions";
import { mockTreasuryStats } from "@/data/mockTreasury";

export default function ZinesPage() {
    const [selectedZine, setSelectedZine] = useState<Zine | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBuyClick = (zine: Zine) => {
        setSelectedZine(zine);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedZine(null), 300);
    };

    return (
        <div className="min-h-screen bg-zine-dark">
            <Ticker />
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-flexoki-bg mb-4">
                        Zine Gallery
                    </h1>
                    <p className="font-mono text-sm text-flexoki-bg/60 max-w-2xl">
                        An open publishing house. Browse zines, mint $ZINE, and join the decentralized culture movement.
                    </p>
                </div>

                {/* Main Grid Layout */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Zine Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {MOCK_ZINES.map((zine) => (
                                <ZineCard key={zine.id} zine={zine} onBuyClick={handleBuyClick} />
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar: Sticky */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Treasury Dashboard */}
                            <TreasuryDashboard />

                            {/* Vending Machine (Desktop Only) */}
                            <div className="hidden md:block">
                                <VendingMachine />
                            </div>

                            {/* Activity Feed */}
                            <ZineActivityFeed />
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile FAB */}
            <VendingMachineFAB />

            {/* Buy Modal */}
            <BuyZineModal zine={selectedZine} isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}
