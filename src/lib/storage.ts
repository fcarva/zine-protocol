import { PrismaClient, PixChargeStatus, SupportSource } from "@prisma/client";
import { databaseEnv } from "@/lib/env";
import { type PixChargeRecord } from "@/lib/pix";

export interface SupportEventInput {
  source: "web3" | "pix";
  zineSlug: string;
  amountUsdc6: bigint;
  amountBrlCents?: number;
  payerEmail?: string;
  payerWallet?: string;
  txHash?: string;
  chargeId?: string;
  chainId?: number;
  revnetProject: number;
}

const prisma =
  shouldUsePrisma(databaseEnv.url)
    ? globalThis.__zinePrisma ||
      new PrismaClient({
        datasources: {
          db: {
            url: databaseEnv.url,
          },
        },
        log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
      })
    : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalThis.__zinePrisma = prisma;
}

const memoryCharges = new Map<string, PixChargeRecord>();
const memorySupportEvents: Array<SupportEventInput & { createdAt: Date }> = [];
let didWarnStorageFallback = false;

function shouldUsePrisma(databaseUrl: string | undefined): boolean {
  if (!databaseUrl || !databaseUrl.trim()) return false;

  // Prevent noisy startup failures on Vercel when a local placeholder URL is present.
  if (
    process.env.NODE_ENV === "production" &&
    /localhost|127\.0\.0\.1/i.test(databaseUrl)
  ) {
    return false;
  }

  return true;
}

async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  if (!prisma) {
    return fallback();
  }

  try {
    return await primary();
  } catch (error) {
    if (!didWarnStorageFallback) {
      didWarnStorageFallback = true;
      console.warn(
        "Storage fallback active: Prisma indisponivel, usando armazenamento em memoria.",
      );
      if (process.env.NODE_ENV !== "production") {
        console.warn(error);
      }
    }
    return fallback();
  }
}

export async function savePixCharge(record: PixChargeRecord): Promise<void> {
  await withFallback(
    async () => {
      await prisma!.pixCharge.upsert({
        where: { chargeId: record.chargeId },
        update: {
          status: mapPixStatus(record.status),
          pixQrCode: record.pixQrCode,
          pixCopyPaste: record.pixCopyPaste,
          expiresAt: record.expiresAt,
          paidAt: record.paidAt,
          webhookPayload: record.webhookPayload,
        },
        create: {
          chargeId: record.chargeId,
          zineSlug: record.zineSlug,
          amountBrlCents: record.amountBrlCents,
          amountUsdc6: record.amountUsdc6,
          payerEmail: record.payerEmail,
          payerWallet: record.payerWallet,
          status: mapPixStatus(record.status),
          pixQrCode: record.pixQrCode,
          pixCopyPaste: record.pixCopyPaste,
          expiresAt: record.expiresAt,
          paidAt: record.paidAt,
          webhookPayload: record.webhookPayload,
        },
      });
    },
    () => {
      memoryCharges.set(record.chargeId, record);
    },
  );
}

export async function getPixCharge(chargeId: string): Promise<PixChargeRecord | null> {
  return withFallback(
    async () => {
      const row = await prisma!.pixCharge.findUnique({ where: { chargeId } });
      if (!row) return null;
      return {
        chargeId: row.chargeId,
        zineSlug: row.zineSlug,
        amountBrlCents: row.amountBrlCents,
        amountUsdc6: row.amountUsdc6,
        payerEmail: row.payerEmail,
        payerWallet: row.payerWallet ?? undefined,
        status: row.status,
        pixQrCode: row.pixQrCode,
        pixCopyPaste: row.pixCopyPaste,
        expiresAt: row.expiresAt,
        paidAt: row.paidAt ?? undefined,
        webhookPayload: row.webhookPayload ?? undefined,
      };
    },
    () => memoryCharges.get(chargeId) ?? null,
  );
}

export async function markPixChargePaid(
  chargeId: string,
  payload: string,
): Promise<PixChargeRecord | null> {
  return withFallback(
    async () => {
      const row = await prisma!.pixCharge.update({
        where: { chargeId },
        data: {
          status: PixChargeStatus.paid,
          paidAt: new Date(),
          webhookPayload: payload,
        },
      });

      return {
        chargeId: row.chargeId,
        zineSlug: row.zineSlug,
        amountBrlCents: row.amountBrlCents,
        amountUsdc6: row.amountUsdc6,
        payerEmail: row.payerEmail,
        payerWallet: row.payerWallet ?? undefined,
        status: row.status,
        pixQrCode: row.pixQrCode,
        pixCopyPaste: row.pixCopyPaste,
        expiresAt: row.expiresAt,
        paidAt: row.paidAt ?? undefined,
        webhookPayload: row.webhookPayload ?? undefined,
      };
    },
    () => {
      const charge = memoryCharges.get(chargeId);
      if (!charge) return null;
      if (charge.status === "paid") return charge;
      const updated = {
        ...charge,
        status: "paid" as const,
        paidAt: new Date(),
        webhookPayload: payload,
      };
      memoryCharges.set(chargeId, updated);
      return updated;
    },
  );
}

export async function createSupportEvent(input: SupportEventInput): Promise<void> {
  await withFallback(
    async () => {
      await prisma!.supportEvent.create({
        data: {
          source: input.source === "web3" ? SupportSource.web3 : SupportSource.pix,
          zineSlug: input.zineSlug,
          amountUsdc6: input.amountUsdc6,
          amountBrlCents: input.amountBrlCents,
          payerEmail: input.payerEmail,
          payerWallet: input.payerWallet,
          txHash: input.txHash,
          chargeId: input.chargeId,
          chainId: input.chainId,
          revnetProject: input.revnetProject,
        },
      });
    },
    () => {
      memorySupportEvents.push({ ...input, createdAt: new Date() });
    },
  );
}

export async function getZineSupportTotalUsdc6(zineSlug: string): Promise<bigint> {
  return withFallback(
    async () => {
      const grouped = await prisma!.supportEvent.aggregate({
        where: { zineSlug },
        _sum: { amountUsdc6: true },
      });
      return grouped._sum.amountUsdc6 ?? BigInt(0);
    },
    () =>
      memorySupportEvents
        .filter((event) => event.zineSlug === zineSlug)
        .reduce((acc, event) => acc + event.amountUsdc6, BigInt(0)),
  );
}

function mapPixStatus(status: PixChargeRecord["status"]): PixChargeStatus {
  switch (status) {
    case "paid":
      return PixChargeStatus.paid;
    case "expired":
      return PixChargeStatus.expired;
    case "failed":
      return PixChargeStatus.failed;
    default:
      return PixChargeStatus.pending;
  }
}

declare global {
  var __zinePrisma: PrismaClient | undefined;
}

