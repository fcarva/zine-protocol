"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-flexoki-bg border-b-4 border-zine-dark">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zine-dark" />
                        <span className="font-serif text-xl font-bold text-zine-dark">
                            ZINE PROTOCOL
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/zines"
                            className={`font-mono text-sm uppercase tracking-wider transition-colors ${pathname === "/zines" ? "text-flexoki-red font-bold" : "text-zine-dark/60 hover:text-zine-dark"
                                }`}
                        >
                            Issues
                        </Link>
                        <Link
                            href="/mentions"
                            className={`font-mono text-sm uppercase tracking-wider transition-colors ${pathname === "/mentions" ? "text-flexoki-red font-bold" : "text-zine-dark/60 hover:text-zine-dark"
                                }`}
                        >
                            Mentions
                        </Link>
                        <Link
                            href="/about"
                            className={`font-mono text-sm uppercase tracking-wider transition-colors ${pathname === "/about" ? "text-flexoki-red font-bold" : "text-zine-dark/60 hover:text-zine-dark"
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/supply"
                            className={`font-mono text-sm uppercase tracking-wider transition-colors ${pathname === "/supply" ? "text-flexoki-red font-bold" : "text-zine-dark/60 hover:text-zine-dark"
                                }`}
                        >
                            Supply
                        </Link>
                    </nav>
                </div>
                <WalletButton />
            </div>
        </header>
    );
}
