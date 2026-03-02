import { describe, expect, it, vi } from "vitest";
import { signPayload } from "../lib/pix";

async function createChargeForTest() {
  const { POST: pixCheckout } = await import("../app/api/pix/checkout/route");
  const request = new Request("http://localhost/api/pix/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      zineSlug: "rua-das-copias",
      amountBRL: 10,
      payerEmail: "webhook@example.com",
    }),
  });

  const response = await pixCheckout(request);
  const payload = (await response.json()) as { chargeId: string };
  return payload.chargeId;
}

async function getChargeStatus(chargeId: string): Promise<string> {
  const { GET: pixStatus } = await import("../app/api/pix/status/[chargeId]/route");
  const statusResponse = await pixStatus(new Request("http://localhost"), {
    params: Promise.resolve({ chargeId }),
  });
  const statusPayload = (await statusResponse.json()) as { status: string };
  return statusPayload.status;
}

describe("abacatepay webhook API", () => {
  it("rejects invalid signature", async () => {
    process.env.ABACATEPAY_WEBHOOK_SECRET = "sandbox-secret";
    vi.resetModules();
    const { POST: webhookPost } = await import("../app/api/webhooks/abacatepay/route");

    const body = JSON.stringify({
      type: "charge.paid",
      data: { id: "abacate_unknown", status: "paid" },
    });

    const response = await webhookPost(
      new Request("http://localhost/api/webhooks/abacatepay", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-abacatepay-signature": "invalid-signature",
        },
        body,
      }),
    );

    expect(response.status).toBe(401);
  }, 45000);

  it("ignores non-paid events", async () => {
    process.env.ABACATEPAY_WEBHOOK_SECRET = "sandbox-secret";
    vi.resetModules();
    const { POST: webhookPost } = await import("../app/api/webhooks/abacatepay/route");
    const chargeId = await createChargeForTest();

    const body = JSON.stringify({
      type: "charge.expired",
      data: { id: chargeId, status: "expired" },
    });
    const signature = signPayload(body, "sandbox-secret");

    const response = await webhookPost(
      new Request("http://localhost/api/webhooks/abacatepay", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-abacatepay-signature": signature,
        },
        body,
      }),
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { ignored?: boolean };
    expect(payload.ignored).toBe(true);

    const status = await getChargeStatus(chargeId);
    expect(status).toBe("pending");
  }, 45000);

  it("marks charge as paid and is idempotent", async () => {
    process.env.ABACATEPAY_WEBHOOK_SECRET = "sandbox-secret";
    vi.resetModules();
    const { POST: webhookPost } = await import("../app/api/webhooks/abacatepay/route");
    const chargeId = await createChargeForTest();

    const body = JSON.stringify({
      type: "charge.paid",
      data: { id: chargeId, status: "paid" },
    });
    const signature = signPayload(body, "sandbox-secret");

    const first = await webhookPost(
      new Request("http://localhost/api/webhooks/abacatepay", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-abacatepay-signature": signature,
        },
        body,
      }),
    );
    expect(first.status).toBe(200);

    const second = await webhookPost(
      new Request("http://localhost/api/webhooks/abacatepay", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-abacatepay-signature": signature,
        },
        body,
      }),
    );
    expect(second.status).toBe(200);
    const secondPayload = (await second.json()) as { idempotent?: boolean };
    expect(secondPayload.idempotent).toBe(true);

    const status = await getChargeStatus(chargeId);
    expect(status).toBe("paid");
  }, 45000);
});
