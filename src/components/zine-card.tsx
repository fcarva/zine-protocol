import Image from "next/image";
import Link from "next/link";
import { type Zine } from "@/types/zine";

export function ZineCard({ zine, index }: { zine: Zine; index: number }) {
  const issue = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/zines/${zine.slug}`}
      className="editorial-card stagger-in group block"
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <article className="editorial-panel overflow-hidden rounded-lg p-1.5 transition duration-300 group-hover:shadow-[0_14px_24px_rgba(40,39,38,0.07)]">
        <figure className="relative aspect-[3/4] overflow-hidden rounded-md border border-base-300 bg-base-150 p-2">
          <div className="absolute inset-1 rounded-sm border border-base-200 bg-base-200/60" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-900/12 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <Image
            src={zine.cover_image}
            alt={`Capa de ${zine.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 48vw, 24vw"
            className="xerox-image object-contain object-center p-1 transition duration-500 group-hover:scale-[1.02]"
          />

          <span className="absolute left-1 top-1 rounded border border-base-300 bg-paper/90 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-700">
            Arquivo {issue}
          </span>
          <span className="absolute bottom-1 right-1 rounded border border-base-300 bg-paper/90 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-700 opacity-0 transition duration-300 group-hover:opacity-100">
            Abrir
          </span>
        </figure>

        <div className="space-y-1 px-0.5 pb-0.5 pt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-500">
              {zine.artist_name}
            </span>
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-500">
              {zine.funding_mode === "campaign" ? "Campanha" : "Contínuo"}
            </span>
          </div>

          <h3 className="line-clamp-2 text-[1.18rem] font-semibold leading-[0.95] tracking-[-0.02em] text-ink transition duration-300 group-hover:text-base-950">
            {zine.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}

