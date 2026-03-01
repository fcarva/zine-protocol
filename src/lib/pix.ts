import crypto from "node:crypto";

export type PixChargeStatus = "pending" | "paid" | "expired" | "failed";

export interface PixCheckoutRequest {
  zineSlug: string;
  amountBRL: number;
  payerEmail: string;
  payerWallet?: string;
}

export interface PixChargeRecord {
  chargeId: string;
  zineSlug: string;
  amountBrlCents: number;
  amountUsdc6: bigint;
  payerEmail: string;
  payerWallet?: string;
  status: PixChargeStatus;
  pixQrCode: string;
  pixCopyPaste: string;
  expiresAt: Date;
  paidAt?: Date;
  webhookPayload?: string;
}

export function generateChargeId(): string {
  return `abacate_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export function toBrlCents(amountBRL: number): number {
  return Math.round(amountBRL * 100);
}

export function demoBrlToUsdc6(amountBrlCents: number): bigint {
  const brl = amountBrlCents / 100;
  return BigInt(Math.round(brl * 1_000_000));
}

export function generatePixCopyPaste(chargeId: string, amountBRL: number): string {
  const amount = amountBRL.toFixed(2).replace(",", ".");
  return `00020126580014BR.GOV.BCB.PIX0136sandbox-${chargeId}52040000530398654${amount}5802BR5913ZINEPROTOCOL6009SAOPAULO6214${chargeId}6304ABCD`;
}

export function generatePixQrCodeData(copyPaste: string): string {
  return copyPaste;
}

export function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyWebhookSignature(payload: string, secret: string, signature?: string): boolean {
  if (!secret || !signature) return false;
  const expected = signPayload(payload, secret);

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

