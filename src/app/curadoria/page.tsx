import Link from "next/link";

export default function CuradoriaPage() {
  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Curadoria</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Politica editorial por convite, com criterio publico.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          O arquivo e aberto para leitura, mas a publicacao segue curadoria para manter consistencia
          editorial, diversidade de linguagem e qualidade de material.
        </p>
      </header>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              O que buscamos
            </h2>
            <ul className="space-y-1 text-[0.92rem] leading-snug">
              <li>Projetos com autoria clara e proposta visual consistente.</li>
              <li>Zines com contexto territorial, memoria, pesquisa ou experimentacao grafica.</li>
              <li>Conteudos com leitura integral publicada, sem paywall.</li>
              <li>Disponibilidade para ficha tecnica completa no repositorio.</li>
            </ul>
          </div>

          <div className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              O que evitamos
            </h2>
            <ul className="space-y-1 text-[0.92rem] leading-snug">
              <li>Conteudo sem autorizacao de imagem ou autoria indefinida.</li>
              <li>Publicacoes com metadata incompleta no frontmatter.</li>
              <li>Material que dependa de bloqueio de acesso para ser compreendido.</li>
              <li>Projetos sem relacao com cultura de zine, arte grafica ou publicacao independente.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Fluxo de convite
            </h2>
            <ol className="space-y-1 text-[0.92rem] leading-snug">
              <li>1. Triagem editorial de portfolio e proposta de edicao.</li>
              <li>2. Revisao tecnica do frontmatter e qualidade de imagem.</li>
              <li>3. Publicacao por PR no repositorio com status `published`.</li>
              <li>4. Entrada no indice curatorial e fluxo de apoio.</li>
            </ol>
          </div>

          <div className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Candidatura
            </h2>
            <p className="text-[0.92rem] leading-snug">
              Nesta fase, a publicacao funciona por convite. Se quiser submeter seu zine, envie
              apresentacao curta com 3 paginas de amostra e links de referencia da edicao.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a href="mailto:curadoria@zineprotocol.xyz" className="ui-btn ui-btn-primary">
                Enviar candidatura
              </a>
              <Link href="/como-apoiar" className="ui-btn">
                Como apoiar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
