import Link from "next/link";
import { resourceSections } from "@/lib/ecosystem";

export default function RecursosPage() {
  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Recursos</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Bibliografia, acervos e ferramentas para sustentar o ecossistema.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          Colecao viva de links e referencias para pesquisa, curadoria e publicacao independente em
          rede.
        </p>
      </header>

      <section className="stagger-in space-y-2 border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        {resourceSections.map((section) => (
          <article key={section.id} className="rounded-lg border border-base-300 bg-base-50/60 p-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
              {section.title}
            </p>
            <p className="mt-1 text-[0.82rem] leading-snug text-base-700">{section.description}</p>

            <div className="mt-2 grid gap-1.5 md:grid-cols-2">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded-md border border-base-300 bg-paper/60 p-2 transition hover:border-base-400"
                >
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">{item.type}</p>
                  <h2 className="mt-0.5 text-[0.9rem] font-semibold leading-tight text-ink">{item.title}</h2>
                  <p className="mt-0.5 text-[0.76rem] leading-snug text-base-700">{item.summary}</p>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <div className="flex flex-wrap gap-2">
          <Link href="/ensino" className="ui-btn">
            Trilha de ensino
          </Link>
          <Link href="/eventos" className="ui-btn">
            Agenda de eventos
          </Link>
          <Link href="/curadoria" className="ui-btn ui-btn-primary">
            Publicar por convite
          </Link>
        </div>
      </section>
    </article>
  );
}
