import Link from "next/link";

const valueFlow = [
  {
    title: "Leitura aberta",
    body: "Toda edicao continua aberta no catalogo. O valor nao vem de paywall, vem da comunidade que apoia.",
  },
  {
    title: "Apoio recorrente",
    body: "Apoios em wallet, email ou pix entram no ciclo editorial e financiam novas publicacoes.",
  },
  {
    title: "Governanca ativa",
    body: "Portadores de contexto e de $ZINE discutem, votam e priorizam onde o protocolo deve investir energia.",
  },
  {
    title: "Impacto de rua",
    body: "Mais zines em circulacao, mais artistas publicados e mais infraestrutura coletiva para as proximas tiragens.",
  },
];

const daoRoles = [
  {
    role: "Leitores",
    rights: "Apoiar, votar em propostas abertas e sugerir pautas.",
    duty: "Manter participacao continua no ciclo de leitura e feedback.",
  },
  {
    role: "Editoras",
    rights: "Propor linhas editoriais, calendario e criterios de selecao.",
    duty: "Publicar criterios claros e reportar decisoes de curadoria.",
  },
  {
    role: "Impressoras",
    rights: "Propor rotas de tiragem, distribuicao local e padroes de qualidade.",
    duty: "Entregar rastreabilidade minima de custos e distribuicao.",
  },
  {
    role: "Tesouro Comunidade",
    rights: "Acumular reserva para novos ciclos e manutencao do protocolo.",
    duty: "Operar com transparencia e prioridade em impacto editorial.",
  },
];

const governanceSteps = [
  "1. Propor: proposta com problema, escopo e impacto publico.",
  "2. Discutir: perguntas de clareza e ajuste de redacao.",
  "3. Temperature check: sinal rapido de consenso.",
  "4. Votar: decisao formal com quorum definido.",
  "5. Executar: publicar resultado e registrar implementacao.",
];

export default function DaoModelPage() {
  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">
          Zine DAO / Modelo
        </p>
        <h1 className="mt-2 max-w-5xl text-[2rem] font-semibold uppercase leading-[0.9] tracking-[-0.05em] text-ink sm:text-[2.55rem]">
          Como o protocolo vira uma DAO editorial com token $ZINE.
        </h1>
        <p className="mt-2 max-w-[84ch] text-[0.9rem] leading-snug text-base-700">
          O modelo combina catalogo aberto, apoio direto e governanca publica para alinhar leitores,
          curadoria, impressao e sustentabilidade de longo prazo. Aqui esta a estrutura operacional para
          evoluir do MVP para uma DAO utilitaria.
        </p>
      </header>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "80ms" }}>
        <div className="grid gap-2 md:grid-cols-2">
          {valueFlow.map((item) => (
            <article key={item.title} className="rounded-lg border border-base-300 bg-paper/70 p-3">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">{item.title}</p>
              <p className="mt-1 text-[0.82rem] leading-snug text-base-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-3 lg:grid-cols-2">
          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
              Regras de token no MVP
            </p>
            <ul className="mt-1.5 space-y-1 text-[0.82rem] leading-snug text-base-700">
              <li>$ZINE representa participacao no ciclo editorial, nao promessa de lucro.</li>
              <li>Apoio gera sinal de prioridade para novas pautas e tiragens.</li>
              <li>Governanca com propostas Git-first + board publico no app.</li>
              <li>Evolucao onchain por fases, sem ampliar risco regulatorio no MVP.</li>
            </ul>
          </article>

          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
              Fluxo de governanca
            </p>
            <ol className="mt-1.5 space-y-1 text-[0.82rem] leading-snug text-base-700">
              {governanceSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "150ms" }}>
        <h2 className="text-[1.1rem] font-semibold uppercase tracking-[-0.02em] text-ink sm:text-[1.25rem]">
          Papeis e responsabilidades
        </h2>
        <div className="mt-2 grid gap-2 xl:grid-cols-2">
          {daoRoles.map((entry) => (
            <article key={entry.role} className="rounded-lg border border-base-300 bg-base-50/60 p-3">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">{entry.role}</p>
              <p className="mt-1 text-[0.8rem] leading-snug text-base-700">
                <strong>Direito:</strong> {entry.rights}
              </p>
              <p className="mt-1 text-[0.8rem] leading-snug text-base-700">
                <strong>Dever:</strong> {entry.duty}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "190ms" }}>
        <div className="rounded-lg border border-yellow-300 bg-yellow-50/60 p-2.5 text-[0.76rem] leading-snug text-yellow-900">
          Nota de risco: o protocolo e experimental. O foco e impacto editorial, distribuicao cultural e
          governanca aberta. Nao existe promessa de rendimento financeiro.
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/zine-dao" className="ui-btn ui-btn-primary">
            Abrir board da DAO
          </Link>
          <Link href="/zine-dao/propor" className="ui-btn">
            Escrever proposta
          </Link>
          <Link href="/checkout" className="ui-btn">
            Apoiar o protocolo
          </Link>
        </div>
      </section>
    </article>
  );
}
