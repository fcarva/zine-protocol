import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createGovernanceProposal,
  queryGovernanceProposals,
} from "@/lib/dao-governance";
import { GOVERNANCE_DAO_STATUS_VALUES, GOVERNANCE_STAGE_VALUES } from "@/types/governance";

const createProposalSchema = z.object({
  title: z.string().min(8),
  summary: z.string().min(20),
  body: z.string().min(40),
  cycleLabel: z.string().min(3).optional(),
  governanceCycle: z.number().int().positive().optional(),
  authorName: z.string().min(3),
  authorWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  quorumRequired: z.number().int().positive().max(100000).optional(),
  status: z.enum(["draft", "discussion"]).optional(),
  slug: z.string().min(3).optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = {
      cycle: url.searchParams.get("cycle") || undefined,
      keyword: url.searchParams.get("keyword") || undefined,
      author: url.searchParams.get("author") || undefined,
      status: parseStatus(url.searchParams.get("status")),
      stage: parseStage(url.searchParams.get("stage")),
      limit: parseNumber(url.searchParams.get("limit")),
      page: parseNumber(url.searchParams.get("page")),
      includeDrafts: url.searchParams.get("includeDrafts") === "true",
    };

    const data = await queryGovernanceProposals(query);

    return NextResponse.json({
      ok: true,
      data: {
        proposalInfo: {
          proposalIdPrefix: data.proposalIdPrefix,
          nextProposalId: data.nextProposalId,
        },
        proposals: data.proposals,
        hasMore: data.hasMore,
        total: data.total,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao listar propostas.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = createProposalSchema.parse(await request.json());
    const proposal = await createGovernanceProposal(payload);
    return NextResponse.json({ ok: true, data: proposal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Payload invalido.", issues: error.issues },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Falha ao criar proposta.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function parseStatus(value: string | null) {
  if (!value) return undefined;
  return GOVERNANCE_DAO_STATUS_VALUES.includes(value as (typeof GOVERNANCE_DAO_STATUS_VALUES)[number])
    ? (value as (typeof GOVERNANCE_DAO_STATUS_VALUES)[number])
    : undefined;
}

function parseStage(value: string | null) {
  if (!value) return undefined;
  return GOVERNANCE_STAGE_VALUES.includes(value as (typeof GOVERNANCE_STAGE_VALUES)[number])
    ? (value as (typeof GOVERNANCE_STAGE_VALUES)[number])
    : undefined;
}
