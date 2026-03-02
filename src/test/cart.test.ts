import { describe, expect, it } from "vitest";
import {
  addCartItem,
  cartItemCount,
  cartTotalBrl,
  removeCartItem,
  updateCartItemAmountBrl,
  updateCartItemQuantity,
} from "../lib/cart";
import { type CartItem } from "../types/cart";

const baseItem: CartItem = {
  slug: "rua-das-copias",
  title: "Rua das Copias",
  artistName: "Lia",
  coverImage: "/images/capa.jpg",
  revnetProjectId: 101,
  quantity: 1,
  amountBRL: 25,
};

describe("cart logic", () => {
  it("adds new item and increments quantity when adding same slug", () => {
    const once = addCartItem([], {
      slug: baseItem.slug,
      title: baseItem.title,
      artistName: baseItem.artistName,
      coverImage: baseItem.coverImage,
      revnetProjectId: baseItem.revnetProjectId,
      amountBRL: 20,
    });

    const twice = addCartItem(once, {
      slug: baseItem.slug,
      title: baseItem.title,
      artistName: baseItem.artistName,
      coverImage: baseItem.coverImage,
      revnetProjectId: baseItem.revnetProjectId,
      amountBRL: 20,
    });

    expect(once).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
    expect(twice[0].amountBRL).toBe(20);
  });

  it("clamps quantity and amount updates", () => {
    const withQuantity = updateCartItemQuantity([baseItem], baseItem.slug, 999);
    const withMinQuantity = updateCartItemQuantity(withQuantity, baseItem.slug, 0);
    const withAmount = updateCartItemAmountBrl(withMinQuantity, baseItem.slug, -10);

    expect(withQuantity[0].quantity).toBe(99);
    expect(withMinQuantity[0].quantity).toBe(1);
    expect(withAmount[0].amountBRL).toBe(1);
  });

  it("computes totals and remove", () => {
    const second: CartItem = {
      ...baseItem,
      slug: "sinal-de-fumaca",
      revnetProjectId: 202,
      quantity: 2,
      amountBRL: 30,
    };

    const items = [baseItem, second];
    expect(cartItemCount(items)).toBe(3);
    expect(cartTotalBrl(items)).toBe(85);

    const removed = removeCartItem(items, baseItem.slug);
    expect(removed).toHaveLength(1);
    expect(removed[0].slug).toBe(second.slug);
  });
});
