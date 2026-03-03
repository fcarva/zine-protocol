-- CreateEnum
CREATE TYPE "DaoProposalStatus" AS ENUM (
  'draft',
  'discussion',
  'temperature_check',
  'voting',
  'approved',
  'cancelled',
  'queued',
  'executed',
  'archived'
);

-- CreateTable
CREATE TABLE "DaoProposal" (
  "id" TEXT NOT NULL,
  "proposalCode" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" "DaoProposalStatus" NOT NULL DEFAULT 'discussion',
  "cycleLabel" TEXT NOT NULL,
  "governanceCycle" INTEGER,
  "authorName" TEXT NOT NULL,
  "authorWallet" TEXT,
  "quorumRequired" INTEGER NOT NULL,
  "votesFor" INTEGER NOT NULL DEFAULT 0,
  "votesAgainst" INTEGER NOT NULL DEFAULT 0,
  "votesAbstain" INTEGER NOT NULL DEFAULT 0,
  "source" TEXT NOT NULL DEFAULT 'app',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DaoProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DaoProposal_proposalCode_key" ON "DaoProposal"("proposalCode");

-- CreateIndex
CREATE UNIQUE INDEX "DaoProposal_slug_key" ON "DaoProposal"("slug");

-- CreateIndex
CREATE INDEX "DaoProposal_status_idx" ON "DaoProposal"("status");

-- CreateIndex
CREATE INDEX "DaoProposal_governanceCycle_idx" ON "DaoProposal"("governanceCycle");

-- CreateIndex
CREATE INDEX "DaoProposal_createdAt_idx" ON "DaoProposal"("createdAt");

-- CreateIndex
CREATE INDEX "DaoProposal_authorName_idx" ON "DaoProposal"("authorName");
