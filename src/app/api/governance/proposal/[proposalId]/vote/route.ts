import { NextResponse } from "next/server";
import { z } from "zod";
import { voteGovernanceProposal } from "@/lib/dao-governance";

const voteSchema = z.object({
  choice: z.enum(["for", "against", "abstain"]),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ proposalId: string }> },
) {
  try {
    const { proposalId } = await context.params;
    const payload = voteSchema.parse(await request.json());
    const proposal = await voteGovernanceProposal(proposalId, payload.choice);

    if (!proposal) {
      return NextResponse.json(
        { ok: false, error: "Proposta nao encontrada para votar." },
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

    const message = error instanceof Error ? error.message : "Falha ao registrar voto.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
