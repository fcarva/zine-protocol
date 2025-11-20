"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-flexoki-bg text-zine-dark font-serif selection:bg-flexoki-red/30">
            <Header />

            <article className="max-w-3xl mx-auto px-6 py-20 md:py-32">
                {/* Title Section */}
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        The Death of Print <br />
                        <span className="italic text-flexoki-red">is a Lie.</span>
                    </h1>
                    <div className="w-24 h-1 bg-zine-dark mx-auto" />
                </header>

                {/* Main Content - Editorial Style */}
                <div className="prose prose-xl prose-stone mx-auto font-serif leading-relaxed text-zine-dark/90">
                    <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-flexoki-red first-letter:mr-3 first-letter:float-left">
                        We are drowning in the ephemeral. The feed scrolls, the timeline refreshes, and ideas vanish into the void of the algorithm. Zine Protocol is a rejection of this disposability.
                    </p>
                    <p>
                        We believe that publishing should be permanent, decentralized, and owned by the creators and readers who value it. By anchoring zines to the blockchain, we create a new substrate for literature—one that cannot be censored, deleted, or forgotten.
                    </p>
                    <p>
                        This is not just a platform; it is a protocol for cultural preservation. Every issue minted is a node in a distributed library, a physical artifact waiting to be printed, and a stake in the future of independent media.
                    </p>
                </div>

                {/* Protocol Masthead */}
                <section className="mt-24 pt-12 border-t-4 border-zine-dark">
                    <h2 className="font-mono text-sm uppercase tracking-widest mb-12 text-center">Protocol Masthead</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-mono text-sm">
                        <div className="flex justify-between items-baseline border-b border-zine-dark/20 pb-2">
                            <span className="uppercase tracking-wider text-zine-dark/60">Core Logic</span>
                            <span className="font-bold">ZineRegistry.sol</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-zine-dark/20 pb-2">
                            <span className="uppercase tracking-wider text-zine-dark/60">Tokenomics</span>
                            <span className="font-bold">Revnet.sol</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-zine-dark/20 pb-2">
                            <span className="uppercase tracking-wider text-zine-dark/60">Treasury</span>
                            <span className="font-bold">Juicebox Terminal</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-zine-dark/20 pb-2">
                            <span className="uppercase tracking-wider text-zine-dark/60">Governance</span>
                            <span className="font-bold">GovernorAlpha.sol</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-zine-dark/20 pb-2">
                            <span className="uppercase tracking-wider text-zine-dark/60">Storage</span>
                            <span className="font-bold">IPFS / Arweave</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-zine-dark/20 pb-2">
                            <span className="uppercase tracking-wider text-zine-dark/60">Frontend</span>
                            <span className="font-bold">Vercel / ENS</span>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="font-serif italic text-zine-dark/60">
                            Established 2025. On-chain forever.
                        </p>
                    </div>
                </section>
            </article>

            <Footer />
        </main>
    );
}
