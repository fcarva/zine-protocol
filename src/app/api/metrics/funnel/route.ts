import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupportIntentFunnelMetrics } from "@/lib/storage";

const querySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

function defaultDateRange(): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = querySchema.parse({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
    });

    const defaults = defaultDateRange();
    const from = parsed.from ? new Date(parsed.from) : defaults.from;
    const to = parsed.to ? new Date(parsed.to) : defaults.to;

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return NextResponse.json({ error: "Intervalo de datas invalido." }, { status: 400 });
    }

    if (from > to) {
      return NextResponse.json(
        { error: "Parametro from deve ser menor ou igual ao parametro to." },
        { status: 400 },
      );
    }

    const metrics = await getSupportIntentFunnelMetrics(from, to);
    return NextResponse.json(metrics);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao calcular metricas de funil.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
