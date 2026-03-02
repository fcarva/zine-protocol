import Link from "next/link";
import { TopZineGallery } from "@/components/top-zine-gallery";
import { ZineCard } from "@/components/zine-card";
import { getPublishedZines } from "@/lib/zines";
import { type FundingMode } from "@/types/zine";

type SearchParams = {
  tag?: string;
  mode?: string;
};

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

const modeOptions: Array<{ value: "all" | FundingMode; label: string }> = [
  { value: "all", label: "Todos os modos" },
  { value: "campaign", label: "Campanha" },
  { value: "continuous", label: "Continuo" },
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const zines = await getPublishedZines();
  const params = await searchParams;
  const tags = Array.from(new Set(zines.flatMap((zine) => zine.tags))).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const activeTag =
    typeof params.tag === "string" && tags.includes(params.tag) ? params.tag : "all";
  const activeMode =
    params.mode === "campaign" || params.mode === "continuous" ? params.mode : "all";

  const filteredZines = zines.filter((zine) => {
    const matchesTag = activeTag === "all" || zine.tags.includes(activeTag);
    const matchesMode = activeMode === "all" || zine.funding_mode === activeMode;
    return matchesTag && matchesMode;
  });

  const heroGallery = (filteredZines.length > 0 ? filteredZines : zines).slice(0, 3);
  const hasActiveFilters = activeTag !== "all" || activeMode !== "all";

  return (
    <div className="space-y-2.5 font-sans sm:space-y-3.5">
      <section className="stagger-in border-b border-base-300 pb-3.5">
        <TopZineGallery zines={heroGallery} />
      </section>

      <section className="border-y border-base-300 py-2.5 sm:py-3">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-base-600">
              Filtro por tag
            </p>
            <div className="flex flex-wrap gap-1">
              <FilterPill
                href={buildIndexHref("all", activeMode)}
                label="Todas"
                active={activeTag === "all"}
              />
              {tags.map((tag) => (
                <FilterPill
                  key={tag}
                  href={buildIndexHref(tag, activeMode)}
                  label={tag}
                  active={activeTag === tag}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-base-600">
              Filtro por modo
            </p>
            <div className="flex flex-wrap gap-1">
              {modeOptions.map((mode) => (
                <FilterPill
                  key={mode.value}
                  href={buildIndexHref(activeTag, mode.value)}
                  label={mode.label}
                  active={activeMode === mode.value}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 border-t border-base-300 pt-2">
          <p className="font-mono text-[0.53rem] uppercase tracking-[0.14em] text-base-600">
            {hasActiveFilters
              ? `Resultado filtrado: ${filteredZines.length} zines`
              : `Indice completo: ${filteredZines.length} zines`}
          </p>
        </div>
      </section>

      <section id="indice-curatorial" className="space-y-2">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[1.45rem] font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-ink sm:text-[1.75rem]">
            Indice Curatorial
          </h2>
          <p className="max-w-[35ch] text-right font-mono text-[0.53rem] uppercase tracking-[0.14em] text-base-600">
            Grade editorial compacta para leitura rapida de capa, autoria e contexto.
          </p>
        </div>

        {filteredZines.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5 xl:grid-cols-4">
            {filteredZines.map((zine, index) => (
              <ZineCard key={zine.slug} zine={zine} index={index} />
            ))}
          </div>
        ) : (
          <div className="border border-base-300 p-3">
            <p className="text-[0.84rem] leading-snug text-base-700">
              Nenhum zine encontrado para este recorte. Ajuste os filtros para voltar ao arquivo.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} className={`ui-pill ${active ? "is-active" : ""}`}>
      {label}
    </Link>
  );
}

function buildIndexHref(tag: "all" | string, mode: "all" | FundingMode): string {
  const query = new URLSearchParams();
  if (tag !== "all") query.set("tag", tag);
  if (mode !== "all") query.set("mode", mode);
  const encoded = query.toString();
  return encoded ? `/?${encoded}` : "/";
}
