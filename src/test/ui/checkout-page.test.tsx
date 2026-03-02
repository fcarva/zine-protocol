import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CheckoutPage from "@/app/checkout/page";

vi.mock("next/image", () => ({
  default: () => <div data-testid="next-image-mock" />,
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: undefined, isConnected: false }),
  useChainId: () => 84532,
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [{ uid: "mock-wallet", name: "Mock Wallet" }],
    isPending: false,
  }),
  useDisconnect: () => ({ disconnect: vi.fn() }),
  usePublicClient: () => null,
  useWriteContract: () => ({ writeContractAsync: vi.fn() }),
}));

vi.mock("@/components/cart-provider", () => ({
  useCart: () => ({
    items: [
      {
        slug: "rua-das-copias",
        title: "Rua das Copias",
        artistName: "Lia Nascimento",
        coverImage: "/images/zines/rua-das-copias/cover.jpg",
        revnetProjectId: 569,
        quantity: 1,
        amountBRL: 25,
      },
    ],
    totalBRL: 25,
    itemCount: 1,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    updateAmountBRL: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

describe("CheckoutPage UI smoke", () => {
  it("switches checkout methods and renders method-specific fields", async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    expect(screen.getByText(/Finalizar compra/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Email" }));
    expect(screen.getByLabelText(/Email para finalizar/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pix" }));
    expect(screen.getByLabelText(/Email para comprovante/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Wallet" }));
    expect(screen.getByText(/Conecte uma carteira para pagar no checkout/i)).toBeInTheDocument();
  });
});
