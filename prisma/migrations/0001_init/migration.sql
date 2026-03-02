-- CreateEnum
CREATE TYPE "PixChargeStatus" AS ENUM ('pending', 'paid', 'expired', 'failed');

-- CreateEnum
CREATE TYPE "SupportSource" AS ENUM ('web3', 'pix');

-- CreateTable
CREATE TABLE "PixCharge" (
    "id" TEXT NOT NULL,
    "chargeId" TEXT NOT NULL,
    "zineSlug" TEXT NOT NULL,
    "amountBrlCents" INTEGER NOT NULL,
    "amountUsdc6" BIGINT NOT NULL,
    "payerEmail" TEXT NOT NULL,
    "payerWallet" TEXT,
    "status" "PixChargeStatus" NOT NULL DEFAULT 'pending',
    "pixQrCode" TEXT NOT NULL,
    "pixCopyPaste" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "webhookPayload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PixCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportEvent" (
    "id" TEXT NOT NULL,
    "source" "SupportSource" NOT NULL,
    "zineSlug" TEXT NOT NULL,
    "amountUsdc6" BIGINT NOT NULL,
    "amountBrlCents" INTEGER,
    "payerEmail" TEXT,
    "payerWallet" TEXT,
    "txHash" TEXT,
    "chargeId" TEXT,
    "chainId" INTEGER,
    "revnetProject" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PixCharge_chargeId_key" ON "PixCharge"("chargeId");

-- CreateIndex
CREATE INDEX "SupportEvent_zineSlug_idx" ON "SupportEvent"("zineSlug");

-- CreateIndex
CREATE INDEX "SupportEvent_source_idx" ON "SupportEvent"("source");

-- CreateIndex
CREATE INDEX "SupportEvent_chargeId_idx" ON "SupportEvent"("chargeId");

-- CreateIndex
CREATE INDEX "SupportEvent_txHash_idx" ON "SupportEvent"("txHash");

