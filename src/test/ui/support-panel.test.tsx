import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SupportPanel } from "@/components/support-panel";
import { type Zine } from "@/types/zine";

const addItemMock = vi.fn();
const connectMock = vi.fn();
const disconnectMock = vi.fn();
const writeContractAsyncMock = vi.fn();

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: undefined, isConnected: false }),
  useChainId: () => 84532,
  useConnect: () => ({
    connect: connectMock,
    connectors: [{ uid: "mock-wallet", name: "Mock Wallet" }],
    isPending: false,
  }),
  useDisconnect: () => ({ disconnect: disconnectMock }),
  usePublicClient: () => null,
  useWriteContract: () => ({ writeContractAsync: writeContractAsyncMock }),
}));

vi.mock("@/components/cart-provider", () => ({
  useCart: () => ({
    addItem: addItemMock,
    itemCount: 0,
    items: [],
    totalBRL: 0,
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    updateAmountBRL: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

const zineFixture: Zine = {
  slug: "rua-das-copias",
  title: "Rua das Copias",
  artist_name: "Lia Nascimento",
  artist_wallet: "0xE660b6574b5E6e23c02e35a14A845098ed5b290f",
  cover_image: "/images/zines/rua-das-copias/cover.jpg",
  excerpt: "Fotocopia, memoria e cartografia afetiva.",
  tags: ["zine", "cidade"],
  revnet_project_id: 569,
  funding_mode: "campaign",
  target_usdc: 500,
  deadline_iso: "2026-06-30T23:59:59Z",
  status: "published",
  sort_order: 10,
  content: "# Rua das Copias",
  path: "content/zines/rua-das-copias/index.md",
};

describe("SupportPanel UI smoke", () => {
  beforeEach(() => {
    addItemMock.mockClear();
    connectMock.mockClear();
    disconnectMock.mockClear();
    writeContractAsyncMock.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({}),
      })),
    );
  });

  it("renders CTA and switches between carteira/pix tabs", async () => {
    const user = userEvent.setup();
    render(<SupportPanel zine={zineFixture} />);

    expect(screen.getByRole("heading", { name: "Apoiar este zine" })).toBeInTheDocument();
    expect(screen.getByText(/Projeto Revnet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Pix sandbox/i }));
    expect(screen.getByLabelText(/Email para comprovante/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pagar com Pix sandbox/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Carteira" }));
    expect(screen.getByText(/Projeto Revnet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mock Wallet/i })).toBeInTheDocument();
  });
});
