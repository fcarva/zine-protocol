import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
  it("switches methods and logs intent on email checkout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("/api/support/intent/log")) {
          return {
            ok: true,
            json: async () => ({ ok: true }),
          } as Response;
        }

        if (url.includes("/api/checkout/email")) {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              orderId: "email_order_1",
              status: "confirmed_demo",
              totalBRL: 25,
              customerEmail: "x@y.com",
              message: "Pedido confirmado em modo demo.",
            }),
          } as Response;
        }

        return {
          ok: false,
          json: async () => ({}),
        } as Response;
      }),
    );

    const user = userEvent.setup();
    render(<CheckoutPage />);

    expect(screen.getByText(/Finalizar compra/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Email" }));
    await user.type(screen.getByLabelText(/Email para finalizar/i), "x@y.com");
    await user.click(screen.getByRole("button", { name: /Finalizar por email/i }));

    await waitFor(() => {
      const mockFetch = vi.mocked(fetch);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/support/intent/log",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
