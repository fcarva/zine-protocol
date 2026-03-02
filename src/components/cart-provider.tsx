"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  cartItemCount,
  cartTotalBrl,
  removeCartItem,
  updateCartItemAmountBrl,
  updateCartItemQuantity,
} from "@/lib/cart";
import { type AddCartItemInput, type CartItem } from "@/types/cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalBRL: number;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  updateAmountBRL: (slug: string, amountBRL: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "zineprotocol-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) {
        setHydrated(true);
        return;
      }

      setItems(parsed);
    } catch {
      // ignore invalid persisted payload
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((item: AddCartItemInput) => {
    setItems((current) => addCartItem(current, item));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => removeCartItem(current, slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((current) => updateCartItemQuantity(current, slug, quantity));
  }, []);

  const updateAmountBRL = useCallback((slug: string, amountBRL: number) => {
    setItems((current) => updateCartItemAmountBrl(current, slug, amountBRL));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = cartItemCount(items);
    const totalBRL = cartTotalBrl(items);

    return {
      items,
      itemCount,
      totalBRL,
      addItem,
      removeItem,
      updateQuantity,
      updateAmountBRL,
      clearCart,
    };
  }, [addItem, clearCart, items, removeItem, updateAmountBRL, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa ser usado dentro de CartProvider");
  }

  return context;
}
