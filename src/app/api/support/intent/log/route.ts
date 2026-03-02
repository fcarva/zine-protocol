import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSupportIntentEvent,
  type SupportIntentMethod,
} from "@/lib/storage";
import { getZineBySlug } from "@/lib/zines";

const supportIntentSchema = z.object({
  zineSlug: z.string().min(2),
  method: z.enum(["wallet", "pix", "email"]),
  surface: z.enum(["support_panel", "checkout"]),
  sessionId: z.string().uuid(),
  intentId: z.string().uuid(),
  amountInput: z.string().trim().min(1).max(32).optional(),
  currencyInput: z.string().trim().toLowerCase().min(1).max(8).optional(),
  chainId: z.number().int().positive().optional(),
  walletConnected: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = supportIntentSchema.parse(await request.json());
    const zine = await getZineBySlug(payload.zineSlug);

    if (!zine || zine.status !== "published") {
      return NextResponse.json({ error: "Zine nao encontrado." }, { status: 404 });
    }

    const created = await createSupportIntentEvent({
      zineSlug: zine.slug,
      method: payload.method as SupportIntentMethod,
      surface: payload.surface,
      sessionId: payload.sessionId,
      intentId: payload.intentId,
      amountInput: payload.amountInput,
      currencyInput: payload.currencyInput,
      chainId: payload.chainId,
      walletConnected: payload.walletConnected,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    if (created === "duplicate") {
      return NextResponse.json(
        { error: "intentId duplicado para evento de apoio iniciado." },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao registrar apoio iniciado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
