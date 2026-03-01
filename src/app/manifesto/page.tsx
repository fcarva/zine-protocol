export default function ManifestoPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-stone-300 bg-white p-6 shadow-sm sm:p-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Manifesto</p>
        <h1 className="text-4xl text-stone-900 sm:text-5xl">Zine Protocol</h1>
        <p className="text-stone-700">
          Uma infraestrutura cultural para leitura aberta, financiamento de arte independente e
          curadoria comunitaria.
        </p>
      </header>

      <section className="space-y-3 text-stone-800">
        <h2 className="text-2xl">Princípios</h2>
        <p>
          1) Leitura aberta: o publico acessa os zines sem paywall. 2) Apoio transparente: toda
          contribuicao fica registrada. 3) Curadoria responsavel: publicacao por convite com
          abertura para novas candidaturas.
        </p>
      </section>

      <section className="space-y-3 text-stone-800">
        <h2 className="text-2xl">Como apoiamos artistas</h2>
        <p>
          O apoio pode ser feito por carteira (Base Sepolia/Revnet) ou Pix sandbox. O split inicial
          de referencia e 70/10/10/10, com 10% destinados ao Tesouro Comunidade.
        </p>
      </section>

      <section className="space-y-3 text-stone-800">
        <h2 className="text-2xl">Estado atual do MVP</h2>
        <p>
          Entrega focada para Artizen: catalogo markdown com 3 zines, leitura completa, apoio Web3,
          Pix sandbox com QR e status, e narrativa completa em portugues.
        </p>
      </section>
    </article>
  );
}

