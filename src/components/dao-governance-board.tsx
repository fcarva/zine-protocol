"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MessageSquare, ShieldCheck, Timer, Vote, type LucideIcon } from "lucide-react";

export type DaoProposalStage = "discussion" | "temperature_check" | "vote" | "queued" | "executed";

export interface DaoProposal {
  id: string;
  title: string;
  summary: string;
  stage: DaoProposalStage;
  cycle: string;
  author: string;
  quorumRequired: number;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
}

type VoteChoice = "for" | "against" | "abstain";
type ProposalFilter = "all" | DaoProposalStage;

interface LocalVoteDelta {
  for: number;
  against: number;
  abstain: number;
}

const defaultVoteDelta: LocalVoteDelta = {
  for: 0,
  against: 0,
  abstain: 0,
};

const stageMeta: Record<DaoProposalStage, { label: string; icon: LucideIcon }> = {
  discussion: { label: "Discussao", icon: MessageSquare },
  temperature_check: { label: "Temperature check", icon: Timer },
  vote: { label: "Votacao ativa", icon: Vote },
  queued: { label: "Fila de execucao", icon: ShieldCheck },
  executed: { label: "Executada", icon: CheckCircle2 },
};

const filters: Array<{ id: ProposalFilter; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "discussion", label: "Discussao" },
  { id: "temperature_check", label: "Temp check" },
  { id: "vote", label: "Votacao" },
  { id: "queued", label: "Fila" },
  { id: "executed", label: "Executadas" },
];

function filterButtonClass(active: boolean): string {
  return active ? "ui-tab is-active" : "ui-tab";
}

function voteButtonClass(active: boolean): string {
  return active ? "ui-btn ui-btn-primary !rounded-lg !px-2.5 !py-1.5" : "ui-btn !rounded-lg !px-2.5 !py-1.5";
}

function computeTotalVotes(votes: DaoProposal["votes"]): number {
  return votes.for + votes.against + votes.abstain;
}

export function DaoGovernanceBoard({ proposals }: { proposals: DaoProposal[] }) {
  const [filter, setFilter] = useState<ProposalFilter>("all");
  const [lastVoteChoiceByProposal, setLastVoteChoiceByProposal] = useState<Record<string, VoteChoice>>({});
  const [voteDeltaByProposal, setVoteDeltaByProposal] = useState<Record<string, LocalVoteDelta>>({});

  const filteredProposals = useMemo(() => {
    if (filter === "all") return proposals;
    return proposals.filter((proposal) => proposal.stage === filter);
  }, [filter, proposals]);

  function registerVote(proposalId: string, choice: VoteChoice): void {
    setLastVoteChoiceByProposal((current) => ({ ...current, [proposalId]: choice }));
    setVoteDeltaByProposal((current) => {
      const baseline = current[proposalId] ?? defaultVoteDelta;
      return {
        ...current,
        [proposalId]: {
          ...baseline,
          [choice]: baseline[choice] + 1,
        },
      };
    });
  }

  return (
    <section className="space-y-3">
      <header className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[1.2rem] font-semibold uppercase tracking-[-0.02em] text-ink sm:text-[1.38rem]">
            Governanca de propostas
          </h2>
          <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
            Inspiracao: Nance + Murmur
          </p>
        </div>
        <p className="max-w-[88ch] text-[0.82rem] leading-snug text-base-700">
          Fluxo editorial em ciclo: discutir, testar consenso, votar e executar. Os votos abaixo sao
          de simulacao para UX do MVP e preparam a camada de governanca onchain do $ZINE.
        </p>
      </header>

      <div className="wallet-surface flex flex-wrap gap-1 rounded-lg border border-base-300 p-1">
        {filters.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={filterButtonClass(filter === option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => {
            const delta = voteDeltaByProposal[proposal.id] ?? defaultVoteDelta;
            const currentVotes = {
              for: proposal.votes.for + delta.for,
              against: proposal.votes.against + delta.against,
              abstain: proposal.votes.abstain + delta.abstain,
            };
            const totalVotes = computeTotalVotes(currentVotes);
            const quorumProgress = Math.min(100, Math.round((totalVotes / proposal.quorumRequired) * 100));
            const supportRatio = totalVotes > 0 ? Math.round((currentVotes.for / totalVotes) * 100) : 0;
            const leadingVote = lastVoteChoiceByProposal[proposal.id];
            const StageIcon = stageMeta[proposal.stage].icon;

            return (
              <article key={proposal.id} className="editorial-panel rounded-xl p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-base-600">
                    Proposta {proposal.id}
                  </p>
                  <span className="ui-pill">
                    <StageIcon size={11} className="mr-1" />
                    {stageMeta[proposal.stage].label}
                  </span>
                </div>

                <h3 className="mt-2 text-[1.02rem] font-semibold leading-[1.03] text-ink sm:text-[1.16rem]">
                  {proposal.title}
                </h3>
                <p className="mt-1.5 max-w-[92ch] text-[0.8rem] leading-snug text-base-700">{proposal.summary}</p>

                <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
                  <MetaCell label="Ciclo" value={proposal.cycle} />
                  <MetaCell label="Proponente" value={proposal.author} />
                  <MetaCell label="Quorum alvo" value={`${proposal.quorumRequired} votos`} />
                </div>

                <div className="mt-2.5 space-y-1.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    <MetricCell label="A favor" value={String(currentVotes.for)} />
                    <MetricCell label="Contra" value={String(currentVotes.against)} />
                    <MetricCell label="Abstencao" value={String(currentVotes.abstain)} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[0.72rem] text-base-700">
                      <span>Quorum</span>
                      <span>{quorumProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-200">
                      <div
                        className="h-full rounded-full bg-green-500/75"
                        style={{ width: `${Math.max(4, quorumProgress)}%` }}
                      />
                    </div>
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-600">
                      Apoio atual: {supportRatio}% de votos favoraveis
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => registerVote(proposal.id, "for")}
                    className={voteButtonClass(leadingVote === "for")}
                  >
                    Votar a favor
                  </button>
                  <button
                    type="button"
                    onClick={() => registerVote(proposal.id, "against")}
                    className={voteButtonClass(leadingVote === "against")}
                  >
                    Votar contra
                  </button>
                  <button
                    type="button"
                    onClick={() => registerVote(proposal.id, "abstain")}
                    className={voteButtonClass(leadingVote === "abstain")}
                  >
                    Abster-se
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-lg border border-base-300 bg-base-50/70 p-3 text-[0.8rem] text-base-700">
            Nenhuma proposta encontrada para este filtro.
          </div>
        )}
      </div>
    </section>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-base-300 bg-paper/70 p-2">
      <p className="font-mono text-[0.48rem] uppercase tracking-[0.13em] text-base-500">{label}</p>
      <p className="mt-0.5 text-[0.77rem] font-medium text-base-800">{value}</p>
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-50/80 p-2">
      <p className="font-mono text-[0.48rem] uppercase tracking-[0.13em] text-base-500">{label}</p>
      <p className="mt-0.5 text-[0.92rem] font-semibold text-base-900">{value}</p>
    </div>
  );
}
