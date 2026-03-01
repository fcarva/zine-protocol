import Image from "next/image";
import Link from "next/link";
import { type Zine } from "@/types/zine";

export function ZineCard({ zine }: { zine: Zine }) {
  return (
    <Link
      href={`/zines/${zine.slug}`}
      className="group overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={zine.cover_image}
          alt={`Capa de ${zine.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{zine.artist_name}</p>
          <h3 className="text-xl font-semibold text-stone-900">{zine.title}</h3>
        </div>

        <p className="line-clamp-2 text-sm text-stone-700">{zine.excerpt}</p>

        <div className="flex flex-wrap gap-2">
          {zine.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-stone-300 px-2 py-1 text-xs text-stone-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

