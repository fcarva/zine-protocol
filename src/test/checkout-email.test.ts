import { describe, expect, it } from "vitest";
import { POST as checkoutEmail } from "../app/api/checkout/email/route";

describe("checkout email API", () => {
  it("returns 400 for invalid payload", async () => {
    const request = new Request("http://localhost/api/checkout/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerEmail: "nao-email",
        items: [],
      }),
    });

    const response = await checkoutEmail(request);
    expect(response.status).toBe(400);
  });

  it("returns 404 when zine is not found", async () => {
    const request = new Request("http://localhost/api/checkout/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerEmail: "pessoa@example.com",
        items: [{ zineSlug: "nao-existe", amountBRL: 30, quantity: 1 }],
      }),
    });

    const response = await checkoutEmail(request);
    const payload = (await response.json()) as { error?: string };

    expect(response.status).toBe(404);
    expect(payload.error).toContain("Zine nao encontrado");
  });

  it("confirms demo checkout for valid zines", async () => {
    const request = new Request("http://localhost/api/checkout/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerEmail: "pessoa@example.com",
        items: [
          { zineSlug: "rua-das-copias", amountBRL: 20, quantity: 2 },
          { zineSlug: "sinal-de-fumaca", amountBRL: 15, quantity: 1 },
        ],
      }),
    });

    const response = await checkoutEmail(request);
    const payload = (await response.json()) as {
      ok: boolean;
      status: string;
      totalBRL: number;
      orderId: string;
    };

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe("confirmed_demo");
    expect(payload.totalBRL).toBe(55);
    expect(payload.orderId.startsWith("email_")).toBe(true);
  });
});
