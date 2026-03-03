import Link from "next/link";
import { editorialEvents } from "@/lib/ecosystem";

export default function EventosPage() {
  const events = [...editorialEvents].sort((a, b) => Date.parse(a.isoDate) - Date.parse(b.isoDate));

  return (
    <article className="space-y-5 font-sans">
      <header className="stagger-in border-b border-base-300 pb-4">
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-base-600">Eventos</p>
        <h1 className="mt-2 max-w-4xl text-[2.1rem] font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-ink sm:text-[2.7rem]">
          Agenda editorial e curatorial do laboratorio de zines.
        </h1>
        <p className="mt-2 max-w-[72ch] text-[0.9rem] leading-snug text-base-700">
          Programacao com datas abertas e ritmos de publicacao para conectar arquivo, ensino e
          apoio.
        </p>
      </header>

      <section className="stagger-in space-y-2 border-b border-base-300 pb-4" style={{ animationDelay: "120ms" }}>
        {events.map((event) => (
          <article key={event.id} className="rounded-lg border border-base-300 bg-base-50/60 p-3">
            <div className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div className="space-y-0.5 border-b border-base-300 pb-1 sm:border-b-0 sm:pb-0">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
                  {new Date(event.isoDate).toLocaleDateString("pt-BR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                  {new Date(event.isoDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">{event.kind}</p>
              </div>

              <div className="space-y-0.5">
                <h2 className="text-[1rem] font-semibold leading-tight text-ink">{event.title}</h2>
                <p className="text-[0.8rem] leading-snug text-base-700">{event.summary}</p>
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-600">
                  {event.location}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="stagger-in border-b border-base-300 pb-4" style={{ animationDelay: "180ms" }}>
        <div className="flex flex-wrap gap-2">
          <Link href="/ensino" className="ui-btn">
            Ver trilhas de ensino
          </Link>
          <Link href="/recursos" className="ui-btn">
            Abrir recursos
          </Link>
          <Link href="/checkout" className="ui-btn ui-btn-primary">
            Apoiar agenda
          </Link>
        </div>
      </section>
    </article>
  );
}
