import { describe, expect, it } from "vitest";
import {
  getPublishedGovernanceProposals,
  parseGovernanceFrontmatter,
} from "../lib/governance";

describe("governance frontmatter", () => {
  it("rejects invalid stage and id format", () => {
    expect(() =>
      parseGovernanceFrontmatter({
        id: "21",
        slug: "orcamento-impressao",
        title: "Orcamento de impressao local para rodada piloto",
        summary: "Resumo longo o suficiente para validacao de frontmatter em ambiente de teste.",
        stage: "invalid",
        cycle: "Ciclo 2026.03",
        author: "Conselho editorial",
        quorum_required: 120,
        votes_for: 20,
        votes_against: 2,
        votes_abstain: 1,
        status: "published",
        sort_order: 10,
      }),
    ).toThrow();
  });

  it("rejects non-discussion proposal without votes", () => {
    expect(() =>
      parseGovernanceFrontmatter({
        id: "ZP-999",
        slug: "sem-votos",
        title: "Proposta sem votos em fase indevida",
        summary: "Resumo com tamanho suficiente para acionar a regra de validacao adicional.",
        stage: "vote",
        cycle: "Ciclo 2026.03",
        author: "Comite de teste",
        quorum_required: 100,
        votes_for: 0,
        votes_against: 0,
        votes_abstain: 0,
        status: "published",
        sort_order: 50,
      }),
    ).toThrow();
  });

  it("loads published governance proposals from repository content", async () => {
    const proposals = await getPublishedGovernanceProposals();
    expect(proposals.length).toBeGreaterThanOrEqual(3);
    expect(proposals.every((proposal) => proposal.status === "published")).toBe(true);
    expect(proposals[0]?.id).toBe("ZP-021");
  });
});
