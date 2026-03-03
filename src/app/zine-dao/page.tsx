import Link from "next/link";
import { DaoGovernanceBoard, type DaoProposal } from "@/components/dao-governance-board";

const governanceProposals: DaoProposal[] = [
  {
    id: "ZP-021",
    title: "Orcamento de impressao local para rodada piloto em Sao Paulo",
    summary:
      "Liberar verba do Tesouro Comunidade para tiragem inicial de 300 copias com distribuicao em pontos independentes.",
    stage: "vote",
    cycle: "Ciclo 2026.03 / Janela de voto ate 12 Mar",
    author: "Conselho editorial Faisca Lab",
    quorumRequired: 120,
    votes: { for: 76, against: 18, abstain: 7 },
  },
  {
    id: "ZP-022",
    title: "Programa de afiliados de bairro para distribuicao de zines",
    summary:
      "Criar micro-repasses por lote entregue para agentes locais, com regras publicas e checkpoint mensal de impacto.",
    stage: "temperature_check",
    cycle: "Ciclo 2026.03 / Sondagem de consenso",
    author: "Rede de distribuicao",
    quorumRequired: 90,
    votes: { for: 44, against: 9, abstain: 15 },
  },
  {
    id: "ZP-023",
    title: "Politica de curadoria para edicoes com coautoria comunitaria",
    summary:
      "Definir criterios de entrada para propostas colaborativas, incluindo transparencia de fonte, credito e direitos de reproducao.",
    stage: "discussion",
    cycle: "Ciclo 2026.03 / Discussao aberta",
    author: "Nucleo de curadoria",
    quorumRequired: 80,
    votes: { for: 22, against: 4, abstain: 11 },
  },
  {
    id: "ZP-019",
    title: "Atualizacao de split para reforcar Tesouro Comunidade",
    summary:
      "Aprovada no ciclo anterior. Mantem 70/10/10/10 e formaliza o bucket de 10% para manutencao da operacao editorial.",
    stage: "executed",
    cycle: "Ciclo 2026.02 / Executada em 26 Fev",
    author: "Comite financeiro",
    quorumRequired: 100,
    votes: { for: 88, against: 12, abstain: 5 },
  },
];

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

export default function ZineDaoPage() {
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
        <DaoGovernanceBoard proposals={governanceProposals} />
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
