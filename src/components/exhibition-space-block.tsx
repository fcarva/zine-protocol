import Image from "next/image";
import Link from "next/link";
import { type Zine } from "@/types/zine";

export function ExhibitionSpaceBlock({ zines }: { zines: Zine[] }) {
  const featured = zines.slice(0, 5);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="editorial-panel rounded-xl p-2.5 sm:p-3">
      <div className="grid gap-2.5 border-b border-base-300 pb-2 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-base-600">
            Exhibition space
          </p>
          <h2 className="max-w-[18ch] text-[1.18rem] font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-ink sm:text-[1.32rem]">
            Leitura aberta em formato de revista-objeto.
          </h2>
          <p className="max-w-[58ch] text-[0.8rem] leading-snug text-base-700">
            Inspirado no ritmo seco e visual-first do ESTAR: menos ruído, capa forte, navegação
            curta e contexto editorial objetivo.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-base-600">
            Nota curatorial
          </p>
          <p className="text-[0.8rem] leading-snug text-base-700">
            O Zine Protocol adapta essa lógica para o nosso ecossistema: leitura sem bloqueio,
            metadados públicos e apoio direto no mesmo fluxo de descoberta.
          </p>
          <div className="flex items-center gap-2 pt-0.5">
            <Link href="/curadoria" className="ui-btn ui-btn-primary">
              Ver criterios
            </Link>
            <Link href="/como-apoiar" className="ui-link text-[0.72rem] uppercase tracking-[0.12em]">
              Como apoiar
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-2 grid gap-1.5 sm:grid-cols-5">
        {featured.map((zine, index) => (
          <Link
            key={zine.slug}
            href={`/zines/${zine.slug}`}
            className="group overflow-hidden rounded-md border border-base-300 bg-base-100 p-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-base-300 bg-base-150">
              <Image
                src={zine.cover_image}
                alt={`Capa de ${zine.title}`}
                fill
                sizes="(max-width: 640px) 48vw, 18vw"
                className="xerox-image object-contain object-center p-1 transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-1 space-y-0.5">
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                Slot {String(index + 1).padStart(2, "0")}
              </p>
              <p className="line-clamp-1 text-[0.72rem] font-semibold leading-tight text-ink">
                {zine.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
