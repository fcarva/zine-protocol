import { describe, expect, it } from "vitest";
import { POST as logWeb3 } from "../app/api/support/web3/log/route";

describe("support web3 log API", () => {
  it("rejects invalid payload", async () => {
    const request = new Request("http://localhost/api/support/web3/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        zineSlug: "rua-das-copias",
        txHash: "0x123",
      }),
    });

    const response = await logWeb3(request);
    expect(response.status).toBe(400);
  });

  it("accepts valid payload", async () => {
    const request = new Request("http://localhost/api/support/web3/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        zineSlug: "rua-das-copias",
        txHash: `0x${"a".repeat(64)}`,
        payerWallet: `0x${"1".repeat(40)}`,
        amountUsdc6: "1000000",
        chainId: 84532,
        revnetProjectId: 101,
      }),
    });

    const response = await logWeb3(request);
    const payload = (await response.json()) as { ok?: boolean };
    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
  });

  it("returns 404 for unknown zine slug", async () => {
    const request = new Request("http://localhost/api/support/web3/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        zineSlug: "nao-existe",
        txHash: `0x${"b".repeat(64)}`,
        payerWallet: `0x${"2".repeat(40)}`,
        amountUsdc6: "1000000",
        chainId: 84532,
        revnetProjectId: 999,
      }),
    });

    const response = await logWeb3(request);
    expect(response.status).toBe(404);
  });

  it("returns 409 when revnetProjectId does not match zine config", async () => {
    const request = new Request("http://localhost/api/support/web3/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        zineSlug: "rua-das-copias",
        txHash: `0x${"c".repeat(64)}`,
        payerWallet: `0x${"3".repeat(40)}`,
        amountUsdc6: "1000000",
        chainId: 84532,
        revnetProjectId: 999,
      }),
    });

    const response = await logWeb3(request);
    expect(response.status).toBe(409);
  });
});
