import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getZineBySlug } from "@/lib/zines";

const emailCheckoutSchema = z.object({
  customerEmail: z.string().email(),
  items: z
    .array(
      z.object({
        zineSlug: z.string().min(2),
        amountBRL: z.number().positive(),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const payload = emailCheckoutSchema.parse(await request.json());

    for (const item of payload.items) {
      const zine = await getZineBySlug(item.zineSlug);
      if (!zine || zine.status !== "published") {
        return NextResponse.json(
          { error: `Zine nao encontrado: ${item.zineSlug}` },
          { status: 404 },
        );
      }
    }

    const orderId = `email_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
    const totalBRL = payload.items.reduce((acc, item) => acc + item.amountBRL * item.quantity, 0);

    return NextResponse.json({
      ok: true,
      orderId,
      status: "confirmed_demo",
      totalBRL,
      customerEmail: payload.customerEmail,
      message:
        "Pedido confirmado em modo demo. Enviaremos instrucoes para pagamento e entrega por email.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no checkout por email.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
