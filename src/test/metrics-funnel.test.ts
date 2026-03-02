import { GET as getFunnel } from "../app/api/metrics/funnel/route";
import { POST as logIntent } from "../app/api/support/intent/log/route";
import { describe, expect, it } from "vitest";

describe("funnel metrics API", () => {
  it("returns starts aggregates for selected period", async () => {
    const now = new Date();
    const from = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const to = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

    const payloads = [
      {
        zineSlug: "rua-das-copias",
        method: "wallet",
        surface: "support_panel",
        sessionId: crypto.randomUUID(),
        intentId: crypto.randomUUID(),
      },
      {
        zineSlug: "sinal-de-fumaca",
        method: "email",
        surface: "checkout",
        sessionId: crypto.randomUUID(),
        intentId: crypto.randomUUID(),
      },
    ];

    for (const payload of payloads) {
      const request = new Request("http://localhost/api/support/intent/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const response = await logIntent(request);
      expect(response.status).toBe(200);
    }

    const response = await getFunnel(
      new Request(`http://localhost/api/metrics/funnel?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
    );

    const metrics = (await response.json()) as {
      starts_total: number;
      starts_by_method: Array<{ method: string; count: number }>;
      starts_by_zine: Array<{ zineSlug: string; count: number }>;
      starts_by_surface: Array<{ surface: string; count: number }>;
    };

    expect(response.status).toBe(200);
    expect(metrics.starts_total).toBeGreaterThanOrEqual(2);
    expect(metrics.starts_by_method.some((entry) => entry.method === "wallet")).toBe(true);
    expect(metrics.starts_by_method.some((entry) => entry.method === "email")).toBe(true);
    expect(metrics.starts_by_zine.some((entry) => entry.zineSlug === "rua-das-copias")).toBe(true);
    expect(metrics.starts_by_surface.some((entry) => entry.surface === "checkout")).toBe(true);
  });
});
