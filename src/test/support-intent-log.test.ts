import { POST as logIntent } from "../app/api/support/intent/log/route";
import { describe, expect, it } from "vitest";

describe("support intent log API", () => {
  it("accepts valid payload and records one intent event", async () => {
    const request = new Request("http://localhost/api/support/intent/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zineSlug: "rua-das-copias",
        method: "wallet",
        surface: "support_panel",
        sessionId: crypto.randomUUID(),
        intentId: crypto.randomUUID(),
        amountInput: "10",
        currencyInput: "usd",
        chainId: 84532,
        walletConnected: true,
      }),
    });

    const response = await logIntent(request);
    const payload = (await response.json()) as { ok?: boolean };

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
  });

  it("returns 409 for duplicated intentId", async () => {
    const duplicatedIntentId = crypto.randomUUID();

    const buildRequest = () =>
      new Request("http://localhost/api/support/intent/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zineSlug: "rua-das-copias",
          method: "pix",
          surface: "checkout",
          sessionId: crypto.randomUUID(),
          intentId: duplicatedIntentId,
          amountInput: "25",
          currencyInput: "brl",
          walletConnected: false,
        }),
      });

    const first = await logIntent(buildRequest());
    const second = await logIntent(buildRequest());
    const secondPayload = (await second.json()) as { error?: string };

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);
    expect(secondPayload.error).toMatch(/intentId duplicado/i);
  });

  it("rejects invalid method", async () => {
    const request = new Request("http://localhost/api/support/intent/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zineSlug: "rua-das-copias",
        method: "nft",
        surface: "support_panel",
        sessionId: crypto.randomUUID(),
        intentId: crypto.randomUUID(),
      }),
    });

    const response = await logIntent(request);
    expect(response.status).toBe(400);
  });
});
