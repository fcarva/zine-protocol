import { NextResponse } from "next/server";
import { z } from "zod";
import {
  demoBrlToUsdc6,
  generateChargeId,
  generatePixCopyPaste,
  generatePixQrCodeData,
  toBrlCents,
} from "@/lib/pix";
import { savePixCharge } from "@/lib/storage";
import { getZineBySlug } from "@/lib/zines";

const checkoutSchema = z.object({
  zineSlug: z.string().min(2),
  amountBRL: z.number().positive(),
  payerEmail: z.string().email(),
  payerWallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
});

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const zine = await getZineBySlug(payload.zineSlug);

    if (!zine || zine.status !== "published") {
      return NextResponse.json({ error: "Zine nao encontrado." }, { status: 404 });
    }

    const chargeId = generateChargeId();
    const amountBrlCents = toBrlCents(payload.amountBRL);
    const amountUsdc6 = demoBrlToUsdc6(amountBrlCents);
    const pixCopyPaste = generatePixCopyPaste(chargeId, payload.amountBRL);
    const pixQrCode = generatePixQrCodeData(pixCopyPaste);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await savePixCharge({
      chargeId,
      zineSlug: payload.zineSlug,
      amountBrlCents,
      amountUsdc6,
      payerEmail: payload.payerEmail,
      payerWallet: payload.payerWallet,
      status: "pending",
      pixQrCode,
      pixCopyPaste,
      expiresAt,
    });

    return NextResponse.json({
      chargeId,
      pixQrCode,
      pixCopyPaste,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro no checkout Pix.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

