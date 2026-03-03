import Link from "next/link";
import { EditorialSeries } from "@/components/editorial-series";
import { EcosystemCalendar } from "@/components/ecosystem-calendar";
import { EstarContextStrip } from "@/components/estar-context-strip";
import { ExhibitionSpaceBlock } from "@/components/exhibition-space-block";
import { TopZineGallery } from "@/components/top-zine-gallery";
import { ZineCard } from "@/components/zine-card";
import { editorialEvents } from "@/lib/ecosystem";
import { getPublishedZines } from "@/lib/zines";
import { type FundingMode } from "@/types/zine";

type SearchParams = {
  tag?: string;
  mode?: string;
  language?: string;
  city?: string;
  format?: string;
  theme?: string;
};

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

interface FilterState {
  tag: string;
  mode: "all" | FundingMode;
  language: string;
  city: string;
  format: string;
  theme: string;
}

const modeOptions: Array<{ value: "all" | FundingMode; label: string }> = [
  { value: "all", label: "Todos os modos" },
  { value: "campaign", label: "Campanha" },
  { value: "continuous", label: "Continuo" },
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const zines = await getPublishedZines();
  const params = await searchParams;

  const tags = sortedUnique(zines.flatMap((zine) => zine.tags));
  const languages = sortedUnique(zines.map((zine) => zine.language));
  const cities = sortedUnique(zines.map((zine) => zine.city));
  const formats = sortedUnique(zines.map((zine) => zine.format));
  const themes = sortedUnique(zines.flatMap((zine) => zine.themes_controlled));

  const filters: FilterState = {
    tag: resolveFilter(params.tag, tags),
    mode: params.mode === "campaign" || params.mode === "continuous" ? params.mode : "all",
    language: resolveFilter(params.language, languages),
    city: resolveFilter(params.city, cities),
    format: resolveFilter(params.format, formats),
    theme: resolveFilter(params.theme, themes),
  };

  const filteredZines = zines.filter((zine) => {
    const matchesTag = filters.tag === "all" || zine.tags.includes(filters.tag);
    const matchesMode = filters.mode === "all" || zine.funding_mode === filters.mode;
    const matchesLanguage = filters.language === "all" || zine.language === filters.language;
    const matchesCity = filters.city === "all" || zine.city === filters.city;
    const matchesFormat = filters.format === "all" || zine.format === filters.format;
    const matchesTheme =
      filters.theme === "all" || zine.themes_controlled.includes(filters.theme as typeof zine.themes_controlled[number]);

    return matchesTag && matchesMode && matchesLanguage && matchesCity && matchesFormat && matchesTheme;
  });

  const source = filteredZines.length > 0 ? filteredZines : zines;
  const heroGallery = source.slice(0, 3);
  const editorialSeries = source.slice(0, 4);
  const hasActiveFilters = Object.values(filters).some((value) => value !== "all");

  return (
    <div className="space-y-2.5 font-sans sm:space-y-3.5">
      <section className="stagger-in border-b border-base-300 pb-3.5">
        <TopZineGallery zines={heroGallery} />
      </section>

      <EstarContextStrip />

      <section className="stagger-in border-b border-base-300 pb-3.5" style={{ animationDelay: "90ms" }}>
        <EditorialSeries zines={editorialSeries} />
      </section>

      <section className="stagger-in border-b border-base-300 pb-3.5" style={{ animationDelay: "120ms" }}>
        <ExhibitionSpaceBlock zines={source} />
      </section>

      <section className="stagger-in border-b border-base-300 pb-3.5" style={{ animationDelay: "150ms" }}>
        <EcosystemCalendar events={editorialEvents} />
      </section>

      <section className="border-y border-base-300 py-2.5 sm:py-3">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-base-600">
              Filtro por tag
            </p>
            <div className="flex flex-wrap gap-1">
              <FilterPill href={buildIndexHref({ ...filters, tag: "all" })} label="Todas" active={filters.tag === "all"} />
              {tags.map((tag) => (
                <FilterPill
                  key={tag}
                  href={buildIndexHref({ ...filters, tag })}
                  label={tag}
                  active={filters.tag === tag}
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
                  href={buildIndexHref({ ...filters, mode: mode.value })}
                  label={mode.label}
                  active={filters.mode === mode.value}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 grid gap-2 border-t border-base-300 pt-2 md:grid-cols-2 xl:grid-cols-4">
          <FilterGroup
            label="Idioma"
            allLabel="Todos"
            active={filters.language}
            options={languages}
            buildHref={(value) => buildIndexHref({ ...filters, language: value })}
          />
          <FilterGroup
            label="Cidade"
            allLabel="Todas"
            active={filters.city}
            options={cities}
            buildHref={(value) => buildIndexHref({ ...filters, city: value })}
          />
          <FilterGroup
            label="Formato"
            allLabel="Todos"
            active={filters.format}
            options={formats}
            buildHref={(value) => buildIndexHref({ ...filters, format: value })}
          />
          <FilterGroup
            label="Tema controlado"
            allLabel="Todos"
            active={filters.theme}
            options={themes}
            buildHref={(value) => buildIndexHref({ ...filters, theme: value })}
          />
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
            Grade editorial compacta com metadata de cidade, idioma, formato e tema.
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

function FilterGroup({
  label,
  allLabel,
  active,
  options,
  buildHref,
}: {
  label: string;
  allLabel: string;
  active: string;
  options: string[];
  buildHref: (value: string) => string;
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[0.52rem] uppercase tracking-[0.13em] text-base-600">{label}</p>
      <div className="flex flex-wrap gap-1">
        <FilterPill href={buildHref("all")} label={allLabel} active={active === "all"} />
        {options.map((option) => (
          <FilterPill key={option} href={buildHref(option)} label={option} active={active === option} />
        ))}
      </div>
    </div>
  );
}

function buildIndexHref(filters: FilterState): string {
  const query = new URLSearchParams();
  if (filters.tag !== "all") query.set("tag", filters.tag);
  if (filters.mode !== "all") query.set("mode", filters.mode);
  if (filters.language !== "all") query.set("language", filters.language);
  if (filters.city !== "all") query.set("city", filters.city);
  if (filters.format !== "all") query.set("format", filters.format);
  if (filters.theme !== "all") query.set("theme", filters.theme);
  const encoded = query.toString();
  return encoded ? `/?${encoded}` : "/";
}

function resolveFilter(input: string | undefined, values: string[]): string {
  return typeof input === "string" && values.includes(input) ? input : "all";
}

function sortedUnique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
