import { describe, expect, it } from "vitest";
import { POST as pixCheckout } from "../app/api/pix/checkout/route";
import { GET as pixStatus } from "../app/api/pix/status/[chargeId]/route";

describe("pix checkout API", () => {
  it("creates charge and reads status", async () => {
    const request = new Request("http://localhost/api/pix/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        zineSlug: "rua-das-copias",
        amountBRL: 50,
        payerEmail: "pix@example.com",
      }),
    });

    const checkoutResponse = await pixCheckout(request);
    const checkoutPayload = (await checkoutResponse.json()) as {
      chargeId: string;
      pixQrCode: string;
      pixCopyPaste: string;
      expiresAt: string;
    };

    expect(checkoutResponse.status).toBe(200);
    expect(checkoutPayload.chargeId.startsWith("abacate_")).toBe(true);
    expect(checkoutPayload.pixQrCode.length).toBeGreaterThan(10);
    expect(checkoutPayload.pixCopyPaste.length).toBeGreaterThan(10);

    const statusResponse = await pixStatus(new Request("http://localhost"), {
      params: Promise.resolve({ chargeId: checkoutPayload.chargeId }),
    });
    const statusPayload = (await statusResponse.json()) as { status: string; chargeId: string };

    expect(statusResponse.status).toBe(200);
    expect(statusPayload.chargeId).toBe(checkoutPayload.chargeId);
    expect(["pending", "expired", "paid", "failed"]).toContain(statusPayload.status);
  });
});
