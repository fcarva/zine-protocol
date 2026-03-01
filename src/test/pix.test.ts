import { describe, expect, it } from "vitest";
import { signPayload, verifyWebhookSignature } from "../lib/pix";

describe("pix webhook signature", () => {
  it("validates signature", () => {
    const payload = JSON.stringify({ type: "charge.paid", data: { id: "abacate_123" } });
    const secret = "sandbox-secret";
    const signature = signPayload(payload, secret);

    expect(verifyWebhookSignature(payload, secret, signature)).toBe(true);
    expect(verifyWebhookSignature(payload, secret, "bad-signature")).toBe(false);
  });
});

