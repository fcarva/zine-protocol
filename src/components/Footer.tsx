import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-flexoki-bg-900 text-flexoki-tx-200 py-24 px-4 border-t border-flexoki-bg-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="font-serif text-4xl text-flexoki-bg mb-6">Zine Protocol</h2>
                    <p className="font-mono text-sm max-w-md mb-8">
                        A decentralized publishing house built for the preservation of culture and the liberation of creators.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-3 h-3 bg-flexoki-green rounded-full animate-pulse" />
                        <span className="font-mono text-xs uppercase tracking-widest text-flexoki-green">
                            All Systems Operational
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-flexoki-bg mb-6">
                        Roadmap
                    </h3>
                    <ul className="space-y-4 font-serif text-lg">
                        <li><Link href="#" className="hover:text-flexoki-green transition-colors">Phase 1: Genesis</Link></li>
                        <li><Link href="#" className="hover:text-flexoki-green transition-colors">Phase 2: The Factory</Link></li>
                        <li><Link href="#" className="hover:text-flexoki-green transition-colors">Phase 3: Global Nodes</Link></li>
                        <li><Link href="#" className="hover:text-flexoki-green transition-colors">Whitepaper</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-flexoki-bg mb-6">
                        Connect
                    </h3>
                    <ul className="space-y-4 font-serif text-lg">
                        <li><a href="#" className="hover:text-flexoki-green transition-colors">Twitter / X</a></li>
                        <li><a href="#" className="hover:text-flexoki-green transition-colors">Discord</a></li>
                        <li><a href="#" className="hover:text-flexoki-green transition-colors">GitHub</a></li>
                        <li><a href="#" className="hover:text-flexoki-green transition-colors">Mirror</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-flexoki-bg-800 flex flex-col md:flex-row justify-between items-center font-mono text-xs uppercase tracking-widest opacity-50">
                <p>© 2025 Zine Protocol. Open Source.</p>
                <p>Built on Ethereum</p>
            </div>
        </footer>
    );
}
