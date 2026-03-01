import Image from "next/image";
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

export default async function ZinePage({ params }: { params: { slug: string } }) {
  const zine = await getZineBySlug(params.slug);
  if (!zine || zine.status !== "published") {
    notFound();
  }

  const supportTotal = await getZineSupportTotalUsdc6(zine.slug);
  const campaignProgress = getCampaignProgress(zine, supportTotal);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <article className="space-y-6 rounded-3xl border border-stone-300 bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{zine.artist_name}</p>
            <h1 className="text-4xl leading-tight text-stone-900 sm:text-5xl">{zine.title}</h1>
            <p className="text-stone-700">{zine.excerpt}</p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-stone-300">
            <Image
              src={zine.cover_image}
              alt={`Capa de ${zine.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {zine.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-stone-300 px-2 py-1 text-stone-600">
                #{tag}
              </span>
            ))}
          </div>

          <div className="rounded-xl border border-stone-300 bg-stone-50 p-3 text-sm text-stone-700">
            <p>
              Apoio total registrado: <span className="font-semibold">{formatUsdcFrom6(supportTotal)}</span>
            </p>

            {campaignProgress !== null && (
              <p>
                Progresso da campanha: <span className="font-semibold">{campaignProgress.toFixed(2)}%</span>
              </p>
            )}
          </div>
        </header>

        <MarkdownRenderer content={zine.content} />
      </article>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <SupportPanel zine={zine} />
      </div>
    </div>
  );
}

