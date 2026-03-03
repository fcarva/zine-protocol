import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteGovernanceProposalUnified,
  getGovernanceProposalByAnyIdUnified,
  updateGovernanceProposalUnified,
} from "@/lib/dao-governance";

const updateProposalSchema = z.object({
  title: z.string().min(8).optional(),
  summary: z.string().min(20).optional(),
  body: z.string().min(40).optional(),
  cycleLabel: z.string().min(3).optional(),
  governanceCycle: z.number().int().positive().optional(),
  authorName: z.string().min(3).optional(),
  authorWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  quorumRequired: z.number().int().positive().max(100000).optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  try {
    const { proposalId } = await context.params;
    const proposal = await getGovernanceProposalByAnyIdUnified(proposalId);
    if (!proposal) {
      return NextResponse.json({ ok: false, error: "Proposta nao encontrada." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: proposal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao buscar proposta.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  try {
    const { proposalId } = await context.params;
    const payload = updateProposalSchema.parse(await request.json());
    const proposal = await updateGovernanceProposalUnified(proposalId, payload);

    if (!proposal) {
      return NextResponse.json(
        { ok: false, error: "Proposta nao encontrada ou nao editavel." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: proposal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Payload invalido.", issues: error.issues },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Falha ao atualizar proposta.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  try {
    const { proposalId } = await context.params;
    const ok = await deleteGovernanceProposalUnified(proposalId);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Proposta nao encontrada ou somente leitura." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao remover proposta.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
