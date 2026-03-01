import Link from "next/link";
import { ZineCard } from "@/components/zine-card";
import { getPublishedZines } from "@/lib/zines";

export default async function HomePage() {
  const zines = await getPublishedZines();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-stone-300 bg-white/80 p-6 shadow-sm sm:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-600">Artizen Session 6</p>
        <h1 className="max-w-4xl text-4xl leading-tight text-stone-900 sm:text-6xl">
          Curadoria viva de zines com leitura aberta e apoio direto a artistas.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-stone-700 sm:text-lg">
          Zine Protocol e uma plataforma em portugues para descobrir zines, ler arte no navegador e
          apoiar produtoras e produtores via carteira ou Pix sandbox.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <MetricCard label="Meta Artizen" value="3 zines publicados" />
          <MetricCard label="Meta de apoio" value="10 apoios registrados" />
          <MetricCard label="Meta financeira" value="R$300 equivalente" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl text-stone-900">Catalogo</h2>
          <Link className="text-sm text-stone-700 underline" href="/manifesto">
            Ler manifesto
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {zines.map((zine) => (
            <ZineCard key={zine.slug} zine={zine} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-300 bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}

