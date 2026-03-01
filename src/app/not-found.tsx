import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-stone-300 bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl text-stone-900">Zine nao encontrado</h1>
      <p className="mt-2 text-stone-700">Este conteudo pode estar em rascunho ou nao existe.</p>
      <Link className="mt-4 inline-flex text-sm text-sky-700 underline" href="/">
        Voltar para o catalogo
      </Link>
    </div>
  );
}

