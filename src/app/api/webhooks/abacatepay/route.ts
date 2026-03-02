import { NextResponse } from "next/server";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { verifyWebhookSignature } from "@/lib/pix";
import { createSupportEvent, getPixCharge, markPixChargePaid } from "@/lib/storage";
import { getZineBySlug } from "@/lib/zines";

const webhookSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string().optional(),
    paidAt: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  if (!serverEnv.abacateWebhookSecret) {
    return NextResponse.json({ error: "Webhook secret nao configurado." }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-abacatepay-signature") || undefined;

  if (!verifyWebhookSignature(rawBody, serverEnv.abacateWebhookSecret, signature)) {
    return NextResponse.json({ error: "Assinatura invalida." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const parsed = webhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
  }

  const eventType = parsed.data.type.toLowerCase();
  const paymentStatus = parsed.data.data.status?.toLowerCase();
  const isPaidEvent = eventType.endsWith(".paid") || paymentStatus === "paid";

  if (!isPaidEvent) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const chargeId = parsed.data.data.id;
  const charge = await getPixCharge(chargeId);

  if (!charge) {
    return NextResponse.json({ error: "Charge nao encontrada." }, { status: 404 });
  }

  if (charge.status === "paid") {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  const paid = await markPixChargePaid(chargeId, rawBody);
  if (!paid) {
    return NextResponse.json({ error: "Falha ao atualizar charge." }, { status: 500 });
  }

  const zine = await getZineBySlug(paid.zineSlug);
  if (!zine) {
    return NextResponse.json({ error: "Zine nao encontrado para a charge." }, { status: 404 });
  }

  await createSupportEvent({
    source: "pix",
    zineSlug: paid.zineSlug,
    amountUsdc6: paid.amountUsdc6,
    amountBrlCents: paid.amountBrlCents,
    payerEmail: paid.payerEmail,
    payerWallet: paid.payerWallet,
    chargeId: paid.chargeId,
    revnetProject: zine.revnet_project_id,
  });

  return NextResponse.json({ ok: true });
}
