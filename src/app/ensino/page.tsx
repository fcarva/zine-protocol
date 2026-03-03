import Link from "next/link";
import { teachingTracks } from "@/lib/ecosystem";

export default function EnsinoPage() {
  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Ensino</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Modelos de aula e oficina para publicar zines em comunidade.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          Trilha educativa com protocolos prontos para escolas, bibliotecas e coletivos culturais.
          Cada modelo conecta pratica editorial com publicacao e apoio direto.
        </p>
      </header>

      <section className="stagger-in space-y-2 border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        {teachingTracks.map((track) => (
          <article key={track.id} className="rounded-lg border border-base-300 bg-base-50/60 p-3">
            <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="space-y-1.5">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
                  {track.format} / {track.duration}
                </p>
                <h2 className="text-[1.2rem] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-ink">
                  {track.title}
                </h2>
                <p className="text-[0.82rem] leading-snug text-base-700">{track.objective}</p>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                      Etapas
                    </p>
                    <ul className="space-y-0.5 text-[0.78rem] leading-snug text-base-700">
                      {track.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                      Resultados esperados
                    </p>
                    <ul className="space-y-0.5 text-[0.78rem] leading-snug text-base-700">
                      {track.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <aside className="space-y-1 border-t border-base-300 pt-2 lg:border-l lg:border-t-0 lg:pl-2">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">Publico</p>
                <p className="text-[0.78rem] leading-snug text-base-700">{track.audience}</p>

                <p className="pt-1 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                  Materiais
                </p>
                <p className="text-[0.78rem] leading-snug text-base-700">{track.materials.join(", ")}</p>
              </aside>
            </div>
          </article>
        ))}
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <div className="flex flex-wrap gap-2">
          <Link href="/recursos" className="ui-btn">
            Ver recursos
          </Link>
          <Link href="/eventos" className="ui-btn">
            Agenda editorial
          </Link>
          <Link href="/checkout" className="ui-btn ui-btn-primary">
            Apoiar o laboratorio
          </Link>
        </div>
      </section>
    </article>
  );
}
