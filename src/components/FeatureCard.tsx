import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    className?: string;
}

export default function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
    return (
        <div className={cn(
            "bg-flexoki-bg p-6 border border-flexoki-bg-800 relative font-mono text-flexoki-tx shadow-lg",
            "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-repeating-linear-gradient-to-r before:from-transparent before:via-flexoki-bg-800 before:to-transparent before:bg-[length:10px_1px]",
            "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-repeating-linear-gradient-to-r after:from-transparent via-flexoki-bg-800 to-transparent after:bg-[length:10px_1px]",
            className
        )}>
            <div className="flex justify-between items-start mb-4 border-b border-dashed border-flexoki-tx-200 pb-4">
                <h3 className="text-lg font-bold uppercase tracking-tight">{title}</h3>
                <div className="text-flexoki-tx-200">{icon}</div>
            </div>
            <p className="text-sm leading-relaxed text-flexoki-tx-200 mb-6">
                {description}
            </p>
            <div className="flex justify-between text-xs uppercase text-flexoki-tx-200 border-t border-dashed border-flexoki-tx-200 pt-4">
                <span>Status:</span>
                <span className="text-flexoki-green">Active</span>
            </div>
        </div>
    );
}
