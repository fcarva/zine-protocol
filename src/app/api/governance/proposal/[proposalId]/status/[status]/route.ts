import { NextResponse } from "next/server";
import {
  patchGovernanceProposalStatusUnified,
} from "@/lib/dao-governance";
import { GOVERNANCE_DAO_STATUS_VALUES } from "@/types/governance";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ proposalId: string; status: string }> },
) {
  try {
    const { proposalId, status } = await context.params;
    if (!GOVERNANCE_DAO_STATUS_VALUES.includes(status as (typeof GOVERNANCE_DAO_STATUS_VALUES)[number])) {
      return NextResponse.json({ ok: false, error: "Status invalido." }, { status: 400 });
    }

    const proposal = await patchGovernanceProposalStatusUnified(
      proposalId,
      status as (typeof GOVERNANCE_DAO_STATUS_VALUES)[number],
    );

    if (!proposal) {
      return NextResponse.json(
        { ok: false, error: "Proposta nao encontrada ou somente leitura." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: proposal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao atualizar status.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
