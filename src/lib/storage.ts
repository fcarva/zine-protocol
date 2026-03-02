import {
  Prisma,
  PrismaClient,
  PixChargeStatus,
  SupportMethod,
  SupportSource,
} from "@prisma/client";
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

export type SupportIntentMethod = "wallet" | "pix" | "email";

export interface SupportIntentEventInput {
  zineSlug: string;
  method: SupportIntentMethod;
  surface: string;
  sessionId: string;
  intentId: string;
  amountInput?: string;
  currencyInput?: string;
  chainId?: number;
  walletConnected?: boolean;
  userAgent?: string;
}

export type SupportIntentCreateResult = "created" | "duplicate";

export interface SupportIntentFunnelMetrics {
  from: string;
  to: string;
  starts_total: number;
  starts_by_method: Array<{ method: SupportIntentMethod; count: number }>;
  starts_by_zine: Array<{ zineSlug: string; count: number }>;
  starts_by_surface: Array<{ surface: string; count: number }>;
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
const memorySupportIntentEvents: Array<SupportIntentEventInput & { createdAt: Date }> = [];
const memorySupportIntentIds = new Set<string>();
let didWarnStorageFallback = false;

function shouldUsePrisma(databaseUrl: string | undefined): boolean {
  if (!databaseUrl || !databaseUrl.trim()) return false;

  // Prevent noisy startup failures on Vercel when a local placeholder URL is present.
  if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/i.test(databaseUrl)) {
    return false;
  }

  return true;
}

function warnStorageFallback(error: unknown): void {
  if (!didWarnStorageFallback) {
    didWarnStorageFallback = true;
    console.warn(
      "Storage fallback active: Prisma indisponivel, usando armazenamento em memoria.",
    );
    if (process.env.NODE_ENV !== "production") {
      console.warn(error);
    }
  }
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
    warnStorageFallback(error);
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

export async function createSupportIntentEvent(
  input: SupportIntentEventInput,
): Promise<SupportIntentCreateResult> {
  if (!prisma) {
    return createSupportIntentEventInMemory(input);
  }

  try {
    await prisma.supportIntentEvent.create({
      data: {
        zineSlug: input.zineSlug,
        method: mapSupportMethod(input.method),
        surface: input.surface,
        sessionId: input.sessionId,
        intentId: input.intentId,
        amountInput: input.amountInput,
        currencyInput: input.currencyInput,
        chainId: input.chainId,
        walletConnected: input.walletConnected,
        userAgent: input.userAgent,
      },
    });

    return "created";
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return "duplicate";
    }

    warnStorageFallback(error);
    return createSupportIntentEventInMemory(input);
  }
}

export async function getSupportIntentFunnelMetrics(
  from: Date,
  to: Date,
): Promise<SupportIntentFunnelMetrics> {
  if (!prisma) {
    return getSupportIntentFunnelMetricsFromMemory(from, to);
  }

  try {
    const where = {
      createdAt: {
        gte: from,
        lte: to,
      },
    };

    const [startsTotal, byMethodRaw, byZineRaw, bySurfaceRaw] = await Promise.all([
      prisma.supportIntentEvent.count({ where }),
      prisma.supportIntentEvent.groupBy({
        by: ["method"],
        where,
        _count: { _all: true },
      }),
      prisma.supportIntentEvent.groupBy({
        by: ["zineSlug"],
        where,
        _count: { _all: true },
      }),
      prisma.supportIntentEvent.groupBy({
        by: ["surface"],
        where,
        _count: { _all: true },
      }),
    ]);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      starts_total: startsTotal,
      starts_by_method: byMethodRaw
        .map((row) => ({ method: row.method as SupportIntentMethod, count: row._count._all }))
        .sort((a, b) => b.count - a.count),
      starts_by_zine: byZineRaw
        .map((row) => ({ zineSlug: row.zineSlug, count: row._count._all }))
        .sort((a, b) => b.count - a.count),
      starts_by_surface: bySurfaceRaw
        .map((row) => ({ surface: row.surface, count: row._count._all }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    warnStorageFallback(error);
    return getSupportIntentFunnelMetricsFromMemory(from, to);
  }
}

function createSupportIntentEventInMemory(
  input: SupportIntentEventInput,
): SupportIntentCreateResult {
  if (memorySupportIntentIds.has(input.intentId)) {
    return "duplicate";
  }

  memorySupportIntentIds.add(input.intentId);
  memorySupportIntentEvents.push({ ...input, createdAt: new Date() });
  return "created";
}

function getSupportIntentFunnelMetricsFromMemory(
  from: Date,
  to: Date,
): SupportIntentFunnelMetrics {
  const filtered = memorySupportIntentEvents.filter(
    (event) => event.createdAt >= from && event.createdAt <= to,
  );

  const byMethod = new Map<SupportIntentMethod, number>();
  const byZine = new Map<string, number>();
  const bySurface = new Map<string, number>();

  for (const event of filtered) {
    byMethod.set(event.method, (byMethod.get(event.method) ?? 0) + 1);
    byZine.set(event.zineSlug, (byZine.get(event.zineSlug) ?? 0) + 1);
    bySurface.set(event.surface, (bySurface.get(event.surface) ?? 0) + 1);
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    starts_total: filtered.length,
    starts_by_method: Array.from(byMethod.entries())
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count),
    starts_by_zine: Array.from(byZine.entries())
      .map(([zineSlug, count]) => ({ zineSlug, count }))
      .sort((a, b) => b.count - a.count),
    starts_by_surface: Array.from(bySurface.entries())
      .map(([surface, count]) => ({ surface, count }))
      .sort((a, b) => b.count - a.count),
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  if (error.code !== "P2002") {
    return false;
  }

  const target = error.meta?.target;
  if (Array.isArray(target)) {
    return target.includes("intentId");
  }

  if (typeof target === "string") {
    return target.includes("intentId");
  }

  return true;
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

function mapSupportMethod(method: SupportIntentMethod): SupportMethod {
  if (method === "wallet") return SupportMethod.wallet;
  if (method === "email") return SupportMethod.email;
  return SupportMethod.pix;
}

declare global {
  var __zinePrisma: PrismaClient | undefined;
}
