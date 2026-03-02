import Image from "next/image";
import Link from "next/link";
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
  const featured = filteredZines[0] ?? zines[0] ?? null;
  const heroRail = (filteredZines.length > 0 ? filteredZines : zines).slice(1, 5);
  const hasActiveFilters = activeTag !== "all" || activeMode !== "all";
  const campaignCount = zines.filter((zine) => zine.funding_mode === "campaign").length;
  const continuousCount = zines.length - campaignCount;

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      <section className="stagger-in border-b border-base-300 pb-3.5">
        <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.54rem] uppercase tracking-[0.15em] text-base-600">
              <span>Laboratorio de zines</span>
              <span className="text-base-400">/</span>
              <span>Faisca Lab</span>
              <span className="text-base-400">/</span>
              <span>Artizen Session 6</span>
            </div>

            <h1 className="max-w-4xl text-[1.9rem] font-semibold uppercase leading-[0.87] tracking-[-0.04em] text-ink sm:text-[2.35rem]">
              Arquivo Vivo De Zines Para Leitura Aberta E Apoio Direto
            </h1>

            <p className="max-w-[75ch] text-[0.93rem] leading-snug text-base-700">
              Um indice editorial inspirado pela leitura em paginas abertas do antmag e pela
              clareza de secao da The Drift. Cada zine entra como edicao acessivel, com ficha
              tecnica publica e checkout direto para fortalecer artistas e coletivos.
            </p>

            <div className="grid gap-2 border-y border-base-300 py-2 sm:grid-cols-3">
              <InlineMetric label="Arquivo" value={`${zines.length} zines publicados`} />
              <InlineMetric label="Campanha / Continuo" value={`${campaignCount} / ${continuousCount}`} />
              <InlineMetric label="Checkout" value="Wallet / Email / Pix sandbox" />
            </div>

            <div className="grid gap-2 border-b border-base-300 pb-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="space-y-1">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-500">
                  Linha editorial
                </p>
                <p className="text-[0.86rem] leading-snug text-base-700">
                  Objeto, formato e ritmo visual de zine com navegacao limpa de revista digital.
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5 sm:justify-end">
                <EditorialLink href="/manifesto" label="Manifesto" />
                <EditorialLink href="/checkout" label="Checkout" />
                <EditorialLink href="#indice-curatorial" label="Indice Curatorial" />
              </div>
            </div>
          </div>

          {featured && (
            <Link
              href={`/zines/${featured.slug}`}
              className="editorial-card group block space-y-1.5 rounded-md border border-base-300 bg-base-50 p-1.5"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-base-300 bg-base-150 p-2">
                <div className="absolute inset-1 rounded-sm border border-base-200 bg-base-200/60" />
                <Image
                  src={featured.cover_image}
                  alt={`Capa de ${featured.title}`}
                  fill
                  sizes="320px"
                  className="xerox-image object-contain object-center p-1 transition duration-500 group-hover:scale-[1.01]"
                />
              </div>
              <div className="space-y-0.5 px-1 pb-0.5 pt-2">
                <p className="font-mono text-[0.53rem] uppercase tracking-[0.13em] text-base-600">
                  Edicao em destaque
                </p>
                <p className="line-clamp-2 text-[0.98rem] font-semibold leading-tight text-ink">
                  {featured.title}
                </p>
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.13em] text-base-600">
                  {featured.artist_name}
                </p>
                <p className="line-clamp-2 text-[0.8rem] leading-snug text-base-700">
                  {featured.excerpt}
                </p>
              </div>

              {heroRail.length > 0 && (
                <div className="border-t border-base-300 px-1 pb-0.5 pt-2">
                  <p className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-500">
                    Recent no indice
                  </p>
                  <div className="space-y-0.5">
                    {heroRail.map((item) => (
                      <p
                        key={item.slug}
                        className="line-clamp-1 text-[0.78rem] leading-snug text-base-700"
                      >
                        {item.title}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          )}
        </div>
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

function EditorialLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-base-700 underline-offset-[0.18em] hover:underline"
    >
      {label}
    </Link>
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
    <Link
      href={href}
      className={`rounded-full border px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.12em] transition ${
        active
          ? "border-base-700 bg-base-700 text-paper"
          : "border-base-300 bg-base-50 text-base-700 hover:bg-base-100"
      }`}
    >
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

function InlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-500">{label}</p>
      <p className="text-[0.9rem] font-semibold leading-tight text-base-850">{value}</p>
    </div>
  );
}

