-- CreateEnum
CREATE TYPE "SupportMethod" AS ENUM ('wallet', 'pix', 'email');

-- CreateTable
CREATE TABLE "SupportIntentEvent" (
    "id" TEXT NOT NULL,
    "zineSlug" TEXT NOT NULL,
    "method" "SupportMethod" NOT NULL,
    "surface" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "amountInput" TEXT,
    "currencyInput" TEXT,
    "chainId" INTEGER,
    "walletConnected" BOOLEAN,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportIntentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportIntentEvent_intentId_key" ON "SupportIntentEvent"("intentId");

-- CreateIndex
CREATE INDEX "SupportIntentEvent_zineSlug_idx" ON "SupportIntentEvent"("zineSlug");

-- CreateIndex
CREATE INDEX "SupportIntentEvent_method_idx" ON "SupportIntentEvent"("method");

-- CreateIndex
CREATE INDEX "SupportIntentEvent_createdAt_idx" ON "SupportIntentEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SupportIntentEvent_surface_idx" ON "SupportIntentEvent"("surface");
