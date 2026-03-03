import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SupportPanel } from "@/components/support-panel";
import { type Zine } from "@/types/zine";

let mockIsConnected = false;
let mockAddress: `0x${string}` | undefined;
const connectMock = vi.fn();
const writeContractAsyncMock = vi.fn();

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: mockAddress, isConnected: mockIsConnected }),
  useChainId: () => 84532,
  useConnect: () => ({
    connect: connectMock,
    connectors: [{ uid: "mock-wallet", name: "Mock Wallet" }],
    isPending: false,
  }),
  usePublicClient: () => null,
  useWriteContract: () => ({ writeContractAsync: writeContractAsyncMock }),
}));

vi.mock("@/components/cart-provider", () => ({
  useCart: () => ({
    itemCount: 0,
    items: [],
    totalBRL: 0,
    addItem: vi.fn(),
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
  language: "pt-BR",
  city: "Sao Paulo",
  year: 2026,
  format: "A5",
  themes_controlled: ["zine", "cidade", "fotocopia"],
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
    mockIsConnected = false;
    mockAddress = undefined;
    connectMock.mockClear();
    writeContractAsyncMock.mockClear();

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

        if (url.includes("/api/pix/checkout")) {
          return {
            ok: true,
            json: async () => ({
              chargeId: "abacate_test",
              pixQrCode: "000201010212",
              pixCopyPaste: "000201010212pix",
              expiresAt: new Date(Date.now() + 60_000).toISOString(),
            }),
          } as Response;
        }

        return {
          ok: false,
          json: async () => ({}),
        } as Response;
      }),
    );
  });

  it("renders CTA and logs pix intent when generating QR", async () => {
    const user = userEvent.setup();
    render(<SupportPanel zine={zineFixture} />);

    expect(screen.getByRole("heading", { name: "Apoiar este zine" })).toBeInTheDocument();
    expect(screen.getByText(/Revnet #569/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Pix$/i }));
    await user.type(screen.getByLabelText(/Email para comprovante/i), "pix@test.com");
    await user.click(screen.getByRole("button", { name: /Gerar QR Pix/i }));

    await waitFor(() => {
      const mockFetch = vi.mocked(fetch);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/support/intent/log",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("logs wallet intent on support CTA click", async () => {
    mockIsConnected = true;
    mockAddress = "0xE660b6574b5E6e23c02e35a14A845098ed5b290f";

    const user = userEvent.setup();
    render(<SupportPanel zine={zineFixture} />);

    await user.click(screen.getByRole("button", { name: /Apoiar este zine/i }));

    await waitFor(() => {
      const mockFetch = vi.mocked(fetch);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/support/intent/log",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
