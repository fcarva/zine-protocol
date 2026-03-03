import Link from "next/link";

export default function ManifestoPage() {
  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Manifesto</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Infraestrutura cultural para leitura aberta e apoio direto.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          Zine Protocol conecta catalogo editorial, contexto curatorial e apoio financeiro em uma
          experiencia simples. O zine fica aberto para leitura, enquanto o apoio fortalece artistas,
          coletivos e laboratorios independentes.
        </p>
      </header>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Origem</h2>
            <p>
              O projeto nasce no Laboratorio de Zines do Faisca Lab, com foco em circulacao de
              narrativa independente e publicacao de baixo custo.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Compromisso
            </h2>
            <p>
              Leitura integral sem paywall, metadata aberta e registro de apoio transparente no app.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Modelo</h2>
            <p>
              Wallet na Base Sepolia, Email e Pix sandbox no MVP. Sem NFT e sem jargao de mercado.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Curadoria publica
            </h2>
            <p>
              Publicacao por convite com criterios claros, mantendo abertura para novas candidaturas
              da comunidade.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Referencia editorial
            </h2>
            <p>
              A linguagem visual combina densidade de zine com navegacao limpa de revista digital.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Proxima fase
            </h2>
            <p>
              Evoluir o arquivo para uma DAO editorial com board de propostas, tesouro de comunidade e
              participacao continua no ciclo de decisao.
            </p>
          </section>
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "150ms" }}>
        <h2 className="text-[1.16rem] font-semibold uppercase tracking-[-0.02em] text-ink sm:text-[1.3rem]">
          Contexto DAO no produto
        </h2>
        <p className="mt-1 max-w-[88ch] text-[0.84rem] leading-snug text-base-700">
          O Zine Protocol adota governanca Git-first e board publico para transformar apoio em decisao
          editorial rastreavel. O token $ZINE e tratado como camada de coordenacao comunitaria, com foco
          em circulacao cultural e nao em promessa de retorno financeiro.
        </p>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <div className="flex flex-wrap gap-2">
          <Link href="/curadoria" className="ui-btn">
            Politica de curadoria
          </Link>
          <Link href="/como-apoiar" className="ui-btn ui-btn-primary">
            Como apoiar
          </Link>
          <Link href="/" className="ui-btn">
            Voltar ao indice
          </Link>
          <Link href="/zine-dao/modelo" className="ui-btn">
            Ver modelo DAO
          </Link>
        </div>
      </section>
    </article>
  );
}
