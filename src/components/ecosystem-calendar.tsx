import Link from "next/link";
import { type EditorialEvent } from "@/lib/ecosystem";

export function EcosystemCalendar({ events }: { events: EditorialEvent[] }) {
  const sorted = [...events].sort((a, b) => Date.parse(a.isoDate) - Date.parse(b.isoDate));
  const monthLabel = sorted[0]
    ? new Date(sorted[0].isoDate).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "mes atual";

  return (
    <section className="editorial-panel rounded-xl p-2.5 sm:p-3">
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-2">
          <div className="space-y-1">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-base-600">
              Calendario editorial
            </p>
            <h2 className="text-[1.25rem] font-semibold uppercase leading-[0.92] tracking-[-0.03em] text-ink sm:text-[1.52rem]">
              Agenda de {monthLabel}
            </h2>
            <p className="max-w-[62ch] text-[0.82rem] leading-snug text-base-700">
              Publicacoes, oficinas e chamadas da comunidade para manter ritmo semanal de arquivo
              vivo.
            </p>
          </div>

          <div className="space-y-1.5 border-t border-base-300 pt-2">
            {sorted.map((event) => (
              <article
                key={event.id}
                className="grid gap-1.5 border-b border-base-300 pb-1.5 sm:grid-cols-[130px_minmax(0,1fr)]"
              >
                <div>
                  <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
                    {new Date(event.isoDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </p>
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                    {new Date(event.isoDate).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                    {event.kind}
                  </p>
                  <h3 className="text-[0.92rem] font-semibold leading-tight text-ink">{event.title}</h3>
                  <p className="text-[0.76rem] leading-snug text-base-700">{event.summary}</p>
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-base-600">
                    {event.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-base-300 bg-base-50/60 p-2.5">
          <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-base-600">
            Trilhas do ecossistema
          </p>
          <div className="mt-2 space-y-1.5">
            <Link href="/ensino" className="ui-link block text-[0.84rem] uppercase tracking-[0.08em]">
              Ensino
            </Link>
            <Link href="/recursos" className="ui-link block text-[0.84rem] uppercase tracking-[0.08em]">
              Recursos
            </Link>
            <Link href="/eventos" className="ui-link block text-[0.84rem] uppercase tracking-[0.08em]">
              Eventos
            </Link>
          </div>

          <div className="mt-2 border-t border-base-300 pt-2">
            <p className="text-[0.76rem] leading-snug text-base-700">
              Bloco editorial inspirado em fluxo de biblioteca viva: acervo, ensino e agenda.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
