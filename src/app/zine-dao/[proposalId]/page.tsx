import Link from "next/link";
import { notFound } from "next/navigation";
import { GovernanceStatusControls } from "@/components/governance-status-controls";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getGovernanceProposalByAnyIdUnified } from "@/lib/dao-governance";

export default async function GovernanceProposalDetailPage({
  params,
}: {
  params: Promise<{ proposalId: string }>;
}) {
  const { proposalId } = await params;
  const proposal = await getGovernanceProposalByAnyIdUnified(proposalId);

  if (!proposal) {
    notFound();
  }

  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
  const quorumProgress =
    proposal.quorumRequired > 0 ? Math.min(100, Math.round((totalVotes / proposal.quorumRequired) * 100)) : 0;

  return (
    <article className="space-y-4 font-sans">
      <header className="border-b border-base-300 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-base-600">
            Proposta {proposal.id}
          </p>
          <div className="flex gap-2">
            {proposal.editable && (
              <Link href={`/zine-dao/propor?id=${proposal.id}`} className="ui-btn">
                Editar
              </Link>
            )}
            <Link href="/zine-dao" className="ui-btn">
              Voltar
            </Link>
          </div>
        </div>
        <h1 className="mt-1 text-[1.8rem] font-semibold uppercase tracking-[-0.04em] text-ink sm:text-[2.2rem]">
          {proposal.title}
        </h1>
        <p className="mt-1 max-w-[86ch] text-[0.86rem] leading-snug text-base-700">{proposal.summary}</p>
      </header>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          <div className="rounded-lg border border-base-300 bg-paper/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">Corpo da proposta</p>
            <div className="mt-2">
              <MarkdownRenderer content={proposal.body} />
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">Metadados</p>
            <div className="mt-2 space-y-1 text-[0.8rem] leading-snug text-base-700">
              <p>
                <strong>Ciclo:</strong> {proposal.cycle}
              </p>
              <p>
                <strong>Status:</strong> {proposal.status.replace(/_/g, " ")}
              </p>
              <p>
                <strong>Etapa:</strong> {proposal.stage.replace(/_/g, " ")}
              </p>
              <p>
                <strong>Autor:</strong> {proposal.author}
              </p>
              <p>
                <strong>Fonte:</strong> {proposal.source}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">Votacao</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <Metric label="A favor" value={String(proposal.votes.for)} />
              <Metric label="Contra" value={String(proposal.votes.against)} />
              <Metric label="Abstencao" value={String(proposal.votes.abstain)} />
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[0.75rem] text-base-700">
                <span>Quorum</span>
                <span>{quorumProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-200">
                <div className="h-full rounded-full bg-green-600/75" style={{ width: `${Math.max(4, quorumProgress)}%` }} />
              </div>
            </div>
          </div>

          <GovernanceStatusControls
            proposalId={proposal.id}
            currentStatus={proposal.status}
            editable={proposal.editable}
          />
        </aside>
      </section>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-base-300 bg-paper/80 p-2">
      <p className="font-mono text-[0.48rem] uppercase tracking-[0.13em] text-base-500">{label}</p>
      <p className="mt-0.5 text-[0.9rem] font-semibold text-ink">{value}</p>
    </div>
  );
}
