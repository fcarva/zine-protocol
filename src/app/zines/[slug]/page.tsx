import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { SupportPanel } from "@/components/support-panel";
import { formatUsdcFrom6 } from "@/lib/format";
import { getZineSupportTotalUsdc6 } from "@/lib/storage";
import { getCampaignProgress, getPublishedZines, getZineBySlug } from "@/lib/zines";

export async function generateStaticParams() {
  const zines = await getPublishedZines();
  return zines.map((zine) => ({ slug: zine.slug }));
}

export default async function ZinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const zine = await getZineBySlug(slug);
  if (!zine || zine.status !== "published") {
    notFound();
  }

  const supportTotal = await getZineSupportTotalUsdc6(zine.slug);
  const campaignProgress = getCampaignProgress(zine, supportTotal);
  const pagesContent = extractPagesContent(zine.content);
  const displayDeadline =
    zine.deadline_iso && Number.isFinite(Date.parse(zine.deadline_iso))
      ? new Date(zine.deadline_iso).toLocaleDateString("pt-BR")
      : null;

  return (
    <div className="space-y-2.5 font-sans sm:space-y-3">
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-3">
        <header className="stagger-in border-b border-base-300 pb-3">
          <div className="grid gap-2.5 lg:grid-cols-[minmax(0,350px)_minmax(0,1fr)] lg:items-start">
            <div className="editorial-card relative aspect-[4/5] overflow-hidden rounded-md border border-base-300 bg-base-200">
              <Image
                src={zine.cover_image}
                alt={`Capa de ${zine.title}`}
                fill
                sizes="(max-width: 1280px) 100vw, 350px"
                className="xerox-image object-contain object-center p-1 transition duration-500 hover:scale-[1.015]"
              />
              <span className="absolute bottom-1 left-1 rounded border border-base-300 bg-paper/90 px-1.5 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-700">
                Arquivo {String(zine.sort_order).padStart(2, "0")}
              </span>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-base-600">
                {zine.artist_name}
              </p>
              <h1 className="max-w-4xl text-[1.65rem] font-semibold leading-[0.9] tracking-[-0.03em] text-ink sm:text-[1.9rem] lg:text-[2.15rem]">
                {zine.title}
              </h1>
              <p className="max-w-[64ch] text-[0.82rem] italic leading-snug text-base-700">
                {zine.excerpt}
              </p>

              <div className="flex flex-wrap gap-1">
                {zine.tags.map((tag) => (
                  <span key={tag} className="ui-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-base-300 pt-2">
                <Link href="/" className="ui-link">
                  Voltar ao indice
                </Link>
                <Link href="/manifesto" className="ui-link">
                  Manifesto
                </Link>
              </div>

              <div className="grid gap-1.5 border-t border-base-300 pt-2 sm:grid-cols-2 xl:grid-cols-4">
                <MetaLine label="Apoio registrado" value={formatUsdcFrom6(supportTotal)} />
                {campaignProgress !== null && (
                  <MetaLine label="Progresso campanha" value={`${campaignProgress.toFixed(2)}%`} />
                )}
                <MetaLine label="Modo" value={zine.funding_mode === "campaign" ? "Campanha" : "Continuo"} />
                <MetaLine label="Projeto" value={`#${zine.revnet_project_id}`} />
              </div>

              <p className="text-[0.78rem] leading-snug text-base-700">
                Leitura completa sem bloqueio. Apoio financeiro ativo para manter producao,
                distribuicao e novos ciclos curatoriais.
              </p>
            </div>
          </div>
        </header>

        <div className="stagger-in xl:sticky xl:top-4 xl:h-fit" style={{ animationDelay: "180ms" }}>
          <SupportPanel zine={zine} />
        </div>
      </div>

      <article className="stagger-in border-t border-base-300 pt-2" style={{ animationDelay: "120ms" }}>
        <div className="grid gap-2.5 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-1.5 lg:sticky lg:top-4 lg:self-start">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-500">
              Ficha tecnica
            </p>
            <TechLine label="Titulo" value={zine.title} />
            <TechLine label="Artista" value={zine.artist_name} />
            <TechLine label="Modo" value={zine.funding_mode === "campaign" ? "Campanha" : "Continuo"} />
            <TechLine label="Projeto Revnet" value={`#${zine.revnet_project_id}`} />
            <TechLine label="Wallet artista" value={shortenWallet(zine.artist_wallet)} />
            {zine.funding_mode === "campaign" && zine.target_usdc && (
              <TechLine label="Meta" value={`${zine.target_usdc.toLocaleString("pt-BR")} USDC`} />
            )}
            {zine.funding_mode === "campaign" && displayDeadline && (
              <TechLine label="Prazo" value={displayDeadline} />
            )}
            <p className="pt-1 text-[0.72rem] leading-snug text-base-600">{zine.excerpt}</p>
          </aside>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2 border-b border-base-300 pb-2">
              <h2 className="text-[1.15rem] font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-ink">
                Leitura em paginas abertas
              </h2>
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
                Leitura aberta
              </p>
            </div>
            <div className="pb-0.5 pt-1">
              <MarkdownRenderer content={pagesContent} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function extractPagesContent(content: string): string {
  const marker = /^\s*##\s+(Paginas|P\u00e1ginas)\s+abertas\s*$/im;
  const match = marker.exec(content);
  if (!match || match.index < 0) {
    return content;
  }
  return content.slice(match.index).trim();
}

function shortenWallet(wallet: string): string {
  if (wallet.length < 12) return wallet;
  return `${wallet.slice(0, 8)}...${wallet.slice(-6)}`;
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 border-b border-base-300 pb-1">
      <p className="font-mono text-[0.53rem] uppercase tracking-[0.13em] text-base-500">{label}</p>
      <p className="mt-0.5 text-[0.82rem] font-semibold leading-tight text-base-800">{value}</p>
    </div>
  );
}

function TechLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 border-b border-base-300 pb-1">
      <p className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-base-500">{label}</p>
      <p className="mt-0.5 text-[0.76rem] font-semibold leading-tight text-base-800">{value}</p>
    </div>
  );
}
