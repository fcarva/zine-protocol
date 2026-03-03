import { describe, expect, it } from "vitest";
import { GET as listProposals, POST as createProposal } from "../app/api/governance/proposals/route";
import {
  DELETE as deleteProposal,
  GET as getProposal,
  PUT as updateProposal,
} from "../app/api/governance/proposal/[proposalId]/route";
import { PATCH as patchStatus } from "../app/api/governance/proposal/[proposalId]/status/[status]/route";
import { POST as voteProposal } from "../app/api/governance/proposal/[proposalId]/vote/route";

describe("governance routes", () => {
  it("creates, updates, votes and patches status for DAO proposal", async () => {
    const suffix = Date.now();
    const basePayload = {
      title: `Proposta piloto de distribuicao ${suffix}`,
      summary:
        "Resumo da proposta com detalhes suficientes para validar schema e criar proposta via API.",
      body: "## Objetivo\n\nApoiar distribuicao local em pontos independentes com metas claras.\n\n## Execucao\n\nRodar piloto por 30 dias com relatorio de impacto.",
      cycleLabel: "Ciclo 2026.03 / Janela de votacao",
      governanceCycle: 202603,
      authorName: "Laboratorio Faisca",
      quorumRequired: 120,
      status: "draft",
    };

    const createResponse = await createProposal(
      new Request("http://localhost/api/governance/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload),
      }),
    );
    const created = (await createResponse.json()) as {
      ok: boolean;
      data: { id: string; title: string; votes: { for: number } };
    };

    expect(createResponse.status).toBe(200);
    expect(created.ok).toBe(true);
    expect(created.data.id).toMatch(/^ZP-\d{3}$/);

    const proposalId = created.data.id;

    const loadedResponse = await getProposal(new Request("http://localhost/api/governance/proposal/x"), {
      params: Promise.resolve({ proposalId }),
    });
    const loaded = (await loadedResponse.json()) as { ok: boolean; data: { title: string } };
    expect(loaded.ok).toBe(true);
    expect(loaded.data.title).toContain(String(suffix));

    const updateResponse = await updateProposal(
      new Request("http://localhost/api/governance/proposal/x", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary:
            "Resumo atualizado para sinalizar evolucao editorial do teste de integracao de governanca.",
          body: "## Objetivo\n\nAtualizar corpo com nova rodada de testes.\n\n## Impacto\n\nAlinhar curadoria e distribuicao.",
        }),
      }),
      { params: Promise.resolve({ proposalId }) },
    );
    const updated = (await updateResponse.json()) as { ok: boolean; data: { summary: string } };
    expect(updated.ok).toBe(true);
    expect(updated.data.summary).toContain("atualizado");

    const voteResponse = await voteProposal(
      new Request("http://localhost/api/governance/proposal/x/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: "for" }),
      }),
      { params: Promise.resolve({ proposalId }) },
    );
    const voted = (await voteResponse.json()) as { ok: boolean; data: { votes: { for: number } } };
    expect(voted.ok).toBe(true);
    expect(voted.data.votes.for).toBeGreaterThanOrEqual(1);

    const patchResponse = await patchStatus(new Request("http://localhost/api/governance/proposal/x/status/voting", {
      method: "PATCH",
    }), {
      params: Promise.resolve({ proposalId, status: "voting" }),
    });
    const patched = (await patchResponse.json()) as { ok: boolean; data: { status: string } };
    expect(patched.ok).toBe(true);
    expect(patched.data.status).toBe("voting");

    const listResponse = await listProposals(
      new Request(`http://localhost/api/governance/proposals?keyword=${encodeURIComponent(String(suffix))}`),
    );
    const listed = (await listResponse.json()) as {
      ok: boolean;
      data: { proposals: Array<{ id: string }> };
    };
    expect(listed.ok).toBe(true);
    expect(listed.data.proposals.some((proposal) => proposal.id === proposalId)).toBe(true);

    const deleteResponse = await deleteProposal(new Request("http://localhost/api/governance/proposal/x", {
      method: "DELETE",
    }), {
      params: Promise.resolve({ proposalId }),
    });
    const deleted = (await deleteResponse.json()) as { ok: boolean };
    expect(deleteResponse.status).toBe(200);
    expect(deleted.ok).toBe(true);
  });
});
