import Link from "next/link";

export default function ComoApoiarPage() {
  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Como apoiar</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Apoio direto em tres metodos, sem friccao.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          Leia o zine completo e escolha o metodo que faz mais sentido para voce. O objetivo do
          produto e simplificar o apoio a artistas e coletivos, sem jargao e sem etapas ocultas.
        </p>
      </header>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Wallet</h2>
            <p className="mt-1 text-[1.08rem] font-semibold leading-tight text-ink">Apoio onchain</p>
            <p className="mt-1 text-[0.86rem] leading-snug text-base-700">
              Conecte carteira, escolha valor em USDC de teste e confirme no checkout.
            </p>
          </article>

          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Email</h2>
            <p className="mt-1 text-[1.08rem] font-semibold leading-tight text-ink">Checkout guiado</p>
            <p className="mt-1 text-[0.86rem] leading-snug text-base-700">
              Registre intencao de apoio por email e siga para finalizacao assistida.
            </p>
          </article>

          <article className="rounded-lg border border-base-300 bg-base-50/70 p-3">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">Pix sandbox</h2>
            <p className="mt-1 text-[1.08rem] font-semibold leading-tight text-ink">QR + status</p>
            <p className="mt-1 text-[0.86rem] leading-snug text-base-700">
              Gere QR code, pague no ambiente de teste e acompanhe confirmacao no app.
            </p>
          </article>
        </div>
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Fluxo recomendado
            </h2>
            <ol className="space-y-1 text-[0.92rem] leading-snug">
              <li>1. Abra um zine no indice curatorial.</li>
              <li>2. Clique em Apoiar este zine.</li>
              <li>3. Escolha Wallet, Email ou Pix sandbox.</li>
              <li>4. Finalize e confirme o registro no checkout.</li>
            </ol>
          </div>

          <div className="space-y-2 text-base-800">
            <h2 className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-base-500">
              Links rapidos
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/checkout" className="ui-btn ui-btn-primary">
                Ir para apoiar
              </Link>
              <Link href="/" className="ui-btn">
                Abrir arquivo
              </Link>
              <Link href="/curadoria" className="ui-btn">
                Politica de curadoria
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
