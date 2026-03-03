import Link from "next/link";

export function EstarContextStrip() {
  return (
    <section className="border-y border-base-300 py-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-base-700">
        <Link href="/" className="ui-link !text-[0.56rem] !tracking-[0.16em]">
          Visitar arquivo
        </Link>
        <span className="text-base-500">★</span>
        <Link href="/checkout" className="ui-link !text-[0.56rem] !tracking-[0.16em]">
          Store de apoio
        </Link>
        <span className="text-base-500">★</span>
        <Link href="/curadoria" className="ui-link !text-[0.56rem] !tracking-[0.16em]">
          Curadoria
        </Link>
        <span className="text-base-500">★</span>
        <Link href="/manifesto" className="ui-link !text-[0.56rem] !tracking-[0.16em]">
          Espaco editorial
        </Link>
      </div>
    </section>
  );
}
