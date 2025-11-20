"use client";

import { Check } from "lucide-react";

const BENEFITS = [
    "Governance Rights (DAO Voting)",
    "Exclusive Content Access",
    "Revenue Share (Protocol Fees)",
    "Print-on-Demand Discounts",
    "Early Access to New Issues",
    "Digital Collectible Airdrops"
];

export function BenefitsList() {
    return (
        <div className="bg-flexoki-bg border-2 border-zine-dark p-6 shadow-paper rotate-1">
            <h3 className="font-mono text-xl font-bold text-zine-dark mb-4 uppercase tracking-wider border-b-2 border-zine-dark pb-2">
                Holder Perks
            </h3>
            <ul className="space-y-3">
                {BENEFITS.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 bg-flexoki-green text-flexoki-bg p-0.5 rounded-sm">
                            <Check className="w-3 h-3" />
                        </div>
                        <span className="font-mono text-sm text-zine-dark/80">
                            {benefit}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-zine-dark/20 text-center">
                <p className="font-serif italic text-flexoki-red text-sm">
                    "Ownership is the new readership."
                </p>
            </div>
        </div>
    );
}
