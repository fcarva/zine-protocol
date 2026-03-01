import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-300/70 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
          Zine Protocol
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-stone-700 transition hover:text-stone-900" href="/">
            Catalogo
          </Link>
          <Link
            className="text-stone-700 transition hover:text-stone-900"
            href="/manifesto"
          >
            Manifesto
          </Link>
        </nav>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-400 via-lime-500 to-sky-500" />
    </header>
  );
}

