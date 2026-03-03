import Link from "next/link";
import { CartLink } from "@/components/cart-link";

const navLinks = [
  { href: "/", label: "Zines", index: "01" },
  { href: "/manifesto", label: "Manifesto", index: "02" },
  { href: "/zine-dao", label: "Governanca", index: "03" },
  { href: "/curadoria", label: "Curadoria", index: "04" },
  { href: "/como-apoiar", label: "Como apoiar", index: "05" },
];

export function SiteHeader() {
  return (
    <>
      <header className="editorial-panel relative z-40 border-x-0 border-t-0 px-3 py-2 font-sans backdrop-blur-[2px] lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="ui-link !text-[0.62rem] !tracking-[0.16em] !text-ink">
            Zine Protocol
          </Link>
          <nav className="flex items-center gap-2.5 text-[0.58rem] uppercase tracking-[0.13em] text-base-700">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="ui-link !text-[0.58rem] !tracking-[0.13em]">
                {item.label}
              </Link>
            ))}
            <CartLink className="ui-link !text-[0.58rem] !tracking-[0.13em]" compact />
          </nav>
        </div>
      </header>

      <aside className="editorial-panel !fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] flex-col rounded-none border-y-0 border-l-0 border-r border-r-base-300 font-sans lg:flex">
        <div className="space-y-3.5 p-8 xl:p-10">
          <Link href="/" className="inline-flex flex-col leading-none">
            <span className="text-[1.8rem] font-black uppercase tracking-[-0.04em] text-ink">
              Zine
            </span>
            <span className="-mt-1 text-[1.8rem] font-black uppercase tracking-[-0.04em] text-ink">
              Protocol
            </span>
          </Link>

          <p className="max-w-[12.8rem] text-[0.86rem] leading-snug text-base-700">
            Catalogo editorial de leitura aberta com apoio direto a artistas e coletivos de zine.
          </p>

          <div className="h-px w-full bg-base-300/90" />

          <nav className="space-y-0.5 pt-0.5">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-baseline justify-between rounded-md border border-transparent px-1.5 py-1.5 transition hover:border-base-300 hover:bg-base-100/80"
              >
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-base-500">
                  {item.index}
                </span>
                <span className="text-[0.94rem] font-semibold uppercase tracking-[-0.01em] text-base-800 transition group-hover:text-ink">
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="group flex items-baseline justify-between rounded-md border border-transparent px-1.5 py-1.5 transition hover:border-base-300 hover:bg-base-100/80">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-base-500">06</span>
              <CartLink className="text-[0.94rem] font-semibold uppercase tracking-[-0.01em] text-base-800 transition group-hover:text-ink" />
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
