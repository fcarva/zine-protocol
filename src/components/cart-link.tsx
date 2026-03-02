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
      {compact ? `Checkout (${itemCount})` : `Checkout (${String(itemCount).padStart(2, "0")})`}
    </Link>
  );
}
