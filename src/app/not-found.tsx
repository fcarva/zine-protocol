import Link from "next/link";

export default function NotFound() {
  return (
    <section className="editorial-panel mx-auto max-w-3xl rounded-3xl p-8 sm:p-12">
      <span className="stamp-label">404</span>
      <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-ink sm:text-6xl">
        Zine não encontrado
      </h1>
      <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-base-700">
        Este conteúdo pode estar em rascunho ou fora da curadoria publicada.
      </p>
      <Link
        className="mt-6 inline-flex font-mono text-xs uppercase tracking-[0.18em] text-blue-700 underline"
        href="/"
      >
        Voltar ao arquivo
      </Link>
    </section>
  );
}

