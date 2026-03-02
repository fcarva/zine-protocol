import { type AddCartItemInput, type CartItem } from "@/types/cart";

const DEFAULT_AMOUNT_BRL = 25;

export function addCartItem(current: CartItem[], item: AddCartItemInput): CartItem[] {
  const existing = current.find((entry) => entry.slug === item.slug);
  if (!existing) {
    return [
      ...current,
      {
        slug: item.slug,
        title: item.title,
        artistName: item.artistName,
        coverImage: item.coverImage,
        revnetProjectId: item.revnetProjectId,
        quantity: 1,
        amountBRL: sanitizeAmountBrl(item.amountBRL ?? DEFAULT_AMOUNT_BRL),
      },
    ];
  }

  return current.map((entry) =>
    entry.slug === item.slug
      ? {
          ...entry,
          quantity: clamp(entry.quantity + 1, 1, 99),
        }
      : entry,
  );
}

export function removeCartItem(current: CartItem[], slug: string): CartItem[] {
  return current.filter((entry) => entry.slug !== slug);
}

export function updateCartItemQuantity(
  current: CartItem[],
  slug: string,
  quantity: number,
): CartItem[] {
  return current.map((entry) =>
    entry.slug === slug
      ? {
          ...entry,
          quantity: sanitizeQuantity(quantity),
        }
      : entry,
  );
}

export function updateCartItemAmountBrl(
  current: CartItem[],
  slug: string,
  amountBRL: number,
): CartItem[] {
  return current.map((entry) =>
    entry.slug === slug
      ? {
          ...entry,
          amountBRL: sanitizeAmountBrl(amountBRL),
        }
      : entry,
  );
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((acc, entry) => acc + entry.quantity, 0);
}

export function cartTotalBrl(items: CartItem[]): number {
  return items.reduce((acc, entry) => acc + entry.amountBRL * entry.quantity, 0);
}

export function sanitizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return clamp(Math.round(quantity), 1, 99);
}

export function sanitizeAmountBrl(amountBRL: number): number {
  if (!Number.isFinite(amountBRL)) return DEFAULT_AMOUNT_BRL;
  return Math.max(1, Number(amountBRL.toFixed(2)));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
