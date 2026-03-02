"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { itemCount } = useCart();

  return (
    <Link className={className} href="/checkout">
      <span>Apoiar</span>{" "}
      <span className="inline-flex min-w-[1.9rem] items-center justify-center rounded-full border border-base-300 bg-base-50 px-1.5 py-0.5 font-mono text-[0.52rem] tracking-[0.08em]">
        {compact ? itemCount : String(itemCount).padStart(2, "0")}
      </span>
    </Link>
  );
}
