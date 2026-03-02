"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { type Zine } from "@/types/zine";

interface TopZineGalleryProps {
  zines: Zine[];
}

export function TopZineGallery({ zines }: TopZineGalleryProps) {
  const gallery = useMemo(() => zines.slice(0, 3), [zines]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (gallery.length === 0) {
    return null;
  }

  const active = gallery[activeIndex % gallery.length];

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % gallery.length);
  }

  return (
    <div className="editorial-panel rounded-xl p-2.5 sm:p-3">
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-stretch">
        <div className="flex min-h-[16rem] flex-col justify-between gap-2.5 lg:pr-3 lg:border-r lg:border-base-300">
          <div className="space-y-1">
            <h1 className="max-w-3xl text-[1.4rem] font-semibold uppercase leading-[0.92] tracking-[-0.03em] text-ink sm:text-[1.65rem]">
              Tres zines em destaque
            </h1>
            <p className="max-w-[62ch] text-[0.84rem] leading-snug text-base-700">
              Leitura aberta com apoio direto. Passe para o proximo zine.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.13em] text-base-600">
              {active.artist_name}
            </p>
            <h2 className="text-[1.18rem] font-semibold leading-[0.95] tracking-[-0.02em] text-ink sm:text-[1.36rem]">
              {active.title}
            </h2>
            <p className="max-w-[58ch] text-[0.8rem] leading-snug text-base-700">{active.excerpt}</p>
          </div>

          <div className="flex items-center gap-2 border-t border-base-300 pt-1.5">
            <Link href={`/zines/${active.slug}`} className="ui-btn ui-btn-primary">
              Abrir
            </Link>
            <button
              type="button"
              className="ui-btn inline-flex h-8 w-8 items-center justify-center !rounded-full p-0"
              onClick={handleNext}
              aria-label="Proximo zine"
            >
              <ChevronRight size={15} />
            </button>
            <p className="ml-auto font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">
              {String(activeIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        <Link
          href={`/zines/${active.slug}`}
          className="group relative block overflow-hidden rounded-lg border border-base-300 bg-base-150 p-2"
        >
          <div className="relative h-full min-h-[16rem] overflow-hidden rounded-md border border-base-200 bg-base-200/60 lg:min-h-[20rem]">
            <Image
              src={active.cover_image}
              alt={`Capa de ${active.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="xerox-image object-contain object-center p-1 transition duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
