import Link from "next/link";
import { DaoGovernanceBoard } from "@/components/dao-governance-board";
import { queryGovernanceProposals } from "@/lib/dao-governance";

const nanceCycle = [
  "Propose: proposta estruturada com impacto e escopo.",
  "Discuss: debate assincro com revisao editorial.",
  "Temperature check: medicao de consenso antes da votacao final.",
  "Vote: decisao com janela de tempo e quorum definidos.",
  "Execute: publicacao da decisao e aplicacao operacional.",
];

const murmurRhythm = [
  "Clarifying questions para reduzir ambiguidades.",
  "Reaction round para mapear tensoes antes do voto.",
  "Restate proposal com sintese objetiva do acordo.",
  "Consent check para sinal final de seguranca coletiva.",
];

const contributorGroups = [
  {
    title: "Leitores",
    role: "Financiam leitura aberta, impressao e expansao do arquivo com apoio recorrente.",
  },
  {
    title: "Editoras",
    role: "Definem linha editorial e qualidade de contexto para cada edicao publicada.",
  },
  {
    title: "Impressoras",
    role: "Operam tiragem local e distribuicao fisica no territorio.",
  },
  {
    title: "Investidores de comunidade",
    role: "Sustentam ciclos longos de crescimento sem promessas de retorno fixo.",
  },
];

const treasurySplit = [
  {
    share: "70%",
    target: "Artista / coletivo",
    note: "Execucao da edicao, cache de criacao e continuidade da pesquisa.",
  },
  {
    share: "10%",
    target: "Curadoria editorial",
    note: "Selecao, revisao e qualidade de contexto publico.",
  },
  {
    share: "10%",
    target: "Impressao e distribuicao",
    note: "Tiragem local, logistica e chegada do zine ao territorio.",
  },
  {
    share: "10%",
    target: "Tesouro Comunidade",
    note: "Reserva de longo prazo para novos ciclos e infraestrutura comum.",
  },
];

export default async function ZineDaoPage() {
  const governance = await queryGovernanceProposals({ includeDrafts: true, limit: 80, page: 1 });
  const proposals = governance.proposals;
  const stageStats = proposals.reduce(
    (acc, proposal) => {
      acc[proposal.stage] += 1;
      return acc;
    },
    {
      discussion: 0,
      temperature_check: 0,
      vote: 0,
      queued: 0,
      executed: 0,
    },
  );
  const appCreatedCount = proposals.filter((proposal) => proposal.source === "app").length;

  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">
          Governanca Zine DAO
        </p>
        <h1 className="mt-2 max-w-5xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Votacao editorial para alinhar leitura, curadoria, impressao e crescimento da rede $ZINE.
        </h1>
        <p className="mt-2 max-w-[80ch] text-[0.9rem] leading-snug text-base-700">
          Esta pagina organiza o ciclo de propostas da DAO em um formato pratico para o MVP. O desenho
          combina referencias de ciclo do Nance com dinamica de consentimento inspirada no Murmur para
          tornar a decisao coletiva mais clara, rastreavel e acionavel.
        </p>

        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <MetricBlock label="Propostas no board" value={String(proposals.length)} />
          <MetricBlock label="Em votacao" value={String(stageStats.vote)} />
          <MetricBlock label="Em discussao" value={String(stageStats.discussion)} />
          <MetricBlock label="Criadas no app" value={String(appCreatedCount)} />
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/zine-dao/propor" className="ui-btn ui-btn-primary">
            Escrever proposta
          </Link>
          <Link href="/zine-dao/modelo" className="ui-btn">
            Ver modelo DAO
          </Link>
          <Link href="/checkout" className="ui-btn">
            Apoiar o ciclo
          </Link>
        </div>
      </header>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "90ms" }}>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {contributorGroups.map((group) => (
            <article key={group.title} className="rounded-lg border border-base-300 bg-paper/60 p-2.5">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
                {group.title}
              </p>
              <p className="mt-1 text-[0.78rem] leading-snug text-base-700">{group.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-4">
          {treasurySplit.map((item) => (
            <article key={item.target} className="rounded-lg border border-base-300 bg-base-50/70 p-2.5">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
                Split
              </p>
              <p className="mt-0.5 text-[1.1rem] font-semibold uppercase tracking-[-0.03em] text-ink">
                {item.share}
              </p>
              <p className="mt-0.5 text-[0.8rem] font-medium text-base-800">{item.target}</p>
              <p className="mt-1 text-[0.74rem] leading-snug text-base-700">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "140ms" }}>
        <div className="grid gap-3 lg:grid-cols-2">
          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-base-600">
              Ciclo Nance aplicado
            </p>
            <ol className="mt-1.5 space-y-1 text-[0.82rem] leading-snug text-base-700">
              {nanceCycle.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-base-600">
              Ritmo Murmur no forum
            </p>
            <ol className="mt-1.5 space-y-1 text-[0.82rem] leading-snug text-base-700">
              {murmurRhythm.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <DaoGovernanceBoard proposals={governance.proposals} />
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "220ms" }}>
        <div className="rounded-lg border border-yellow-300 bg-yellow-50/60 p-2.5 text-[0.76rem] leading-snug text-yellow-900">
          Nao ha promessa de retorno financeiro. O modelo de DAO e experimental e depende de atividade
          editorial real para gerar valor cultural e economico no longo prazo.
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/checkout" className="ui-btn ui-btn-primary">
            Apoiar o ciclo
          </Link>
          <Link href="/manifesto" className="ui-btn">
            Ler manifesto
          </Link>
          <Link href="/curadoria" className="ui-btn">
            Ver curadoria
          </Link>
        </div>
      </section>
    </article>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-base-300 bg-paper/70 p-2.5">
      <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">{label}</p>
      <p className="mt-0.5 text-[1.05rem] font-semibold uppercase tracking-[-0.03em] text-ink">{value}</p>
    </article>
  );
}
