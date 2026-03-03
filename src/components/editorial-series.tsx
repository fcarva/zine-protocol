import Image from "next/image";
import Link from "next/link";
import { type Zine } from "@/types/zine";

interface EditorialSeriesProps {
  zines: Zine[];
}

export function EditorialSeries({ zines }: EditorialSeriesProps) {
  const [featured, ...rest] = zines.slice(0, 4);
  const related = rest.slice(0, 3);

  if (!featured) {
    return null;
  }

  return (
    <div className="editorial-panel rounded-xl p-2.5 sm:p-3">
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,24rem)]">
        <article className="rounded-lg border border-base-300 bg-base-50/70 p-2.5 sm:p-3">
          <p className="font-mono text-[0.53rem] uppercase tracking-[0.14em] text-base-600">
            Series editoriais
          </p>
          <h2 className="mt-1 text-[1.25rem] font-semibold uppercase leading-[0.92] tracking-[-0.03em] text-ink sm:text-[1.52rem]">
            {featured.title}
          </h2>
          <p className="mt-1 text-[0.82rem] leading-snug text-base-700">{featured.excerpt}</p>
          <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.13em] text-base-600">
            {featured.artist_name}
          </p>

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-base-300 pt-2">
            <Link href={`/zines/${featured.slug}`} className="ui-btn ui-btn-primary">
              Ler edicao
            </Link>
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
              Destaque 01
            </span>
          </div>

          <div className="relative mt-2 aspect-[21/9] overflow-hidden rounded-md border border-base-300 bg-base-150">
            <Image
              src={featured.cover_image}
              alt={`Capa de ${featured.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 760px"
              className="xerox-image object-contain object-center p-1"
            />
          </div>
        </article>

        <aside className="rounded-lg border border-base-300 bg-base-50/50 p-2.5 sm:p-3">
          <h3 className="font-mono text-[0.53rem] uppercase tracking-[0.14em] text-base-600">
            Outras edicoes da serie
          </h3>

          {related.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {related.map((item, index) => (
                <li key={item.slug} className="border-t border-base-300 pt-1.5">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-600">
                    {String(index + 2).padStart(2, "0")} / {item.artist_name}
                  </p>
                  <Link
                    href={`/zines/${item.slug}`}
                    className="ui-link mt-0.5 block text-[0.96rem] font-semibold leading-tight tracking-[-0.01em] text-ink"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-0.5 line-clamp-2 text-[0.76rem] leading-snug text-base-700">
                    {item.excerpt}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[0.8rem] leading-snug text-base-700">
              Sem itens relacionados publicados no momento.
            </p>
          )}

          <div className="mt-2 border-t border-base-300 pt-2">
            <Link href="/#indice-curatorial" className="ui-link text-[0.72rem] uppercase tracking-[0.12em]">
              Ver indice completo
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
