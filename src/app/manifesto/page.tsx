export default function ManifestoPage() {
  return (
    <article className="space-y-5">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Manifesto</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Infraestrutura cultural para zines vivos.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          Este projeto junta leitura aberta, contexto curatorial e apoio financeiro em linguagem
          simples. A arquitetura editorial foi calibrada com estudo de referencia de campo no
          antmagjpg e no The Drift, cruzando linguagem visual de zine com estrutura de revista de
          ensaios e critica.
        </p>
      </header>

      <div className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Origem</h2>
            <p>
              O Zine Protocol nasce do Laboratorio de Zines do Faisca Lab: um espaco de formacao,
              experimentacao grafica e circulacao de narrativas independentes.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Principios</h2>
            <p>
              Leitura aberta sem paywall. Apoio transparente com registro no app. Curadoria por
              convite com caminho claro para novas candidaturas.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Modelo</h2>
            <p>
              Apoio por carteira na Base Sepolia e Pix sandbox no MVP. Split de referencia
              70/10/10/10 com 10% para Tesouro Comunidade.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Curadoria</h2>
            <p>
              O catalogo funciona como um espaco editorial. Cada zine publicado ganha pagina
              propria, leitura completa, ficha tecnica e contexto de apoio.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Benchmark vivo</h2>
            <p>
              Foram mapeadas 49 paginas de referencia em antmagjpg. Os formatos mais recorrentes
              sao A5, 13x19 cm e 16,5 x 23,5, com paginacao frequente de 24, 28 e 48 paginas.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">The Drift</h2>
            <p>
              O The Drift organiza um fluxo editorial claro entre Issues, Latest e Mentions, com
              combinacao de ensaio longo, critica cultural, ficcao, poesia, entrevista e review
              breve. Esse arranjo orienta nossa proxima fase de curadoria por secoes.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Exemplo SMD7</h2>
            <p>
              A serie SMD mostrou consistencia de linguagem editorial por edicao. No SMD7, a ficha
              de referencia aponta formato 16,5 x 23,5, 48 paginas e primeira edicao em 2025.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Aplicacao no site</h2>
            <p>
              O MVP adota indice denso, bloco de destaque na dobra inicial e manifesto contextual.
              A proxima fase inclui ficha tecnica por zine, historico de edicoes e trilha curatorial
              por autor, alem de secoes inspiradas em fluxo de revista (Latest, Mentions, Essays).
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Politica editorial</h2>
            <p>
              Tambem incorporamos uma pratica de transparencia inspirada no The Drift: explicitar o
              que queremos publicar, o que evitamos e como funciona o contato editorial da curadoria.
            </p>
          </section>

          <section className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Pronto para Artizen</h2>
            <p>
              Tres zines reais, fluxo de apoio Web3 ativo, Pix sandbox com QR e narrativa de produto
              em portugues pronta para demo.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

