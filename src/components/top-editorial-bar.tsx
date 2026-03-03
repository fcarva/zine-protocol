import Link from "next/link";

const topEditorialLinks = [
  { href: "/", label: "Visitar arquivo" },
  { href: "/zine-dao", label: "Governanca DAO" },
  { href: "/checkout", label: "Store de apoio" },
  { href: "/curadoria", label: "Curadoria" },
  { href: "/ensino", label: "Ensino" },
  { href: "/recursos", label: "Recursos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/manifesto", label: "Espaco editorial" },
];

export function TopEditorialBar() {
  return (
    <section className="border-b border-base-300 pb-2 pt-1 sm:pb-2.5 sm:pt-1.5">
      <nav
        aria-label="Navegacao editorial superior"
        className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap font-mono text-[0.56rem] uppercase tracking-[0.14em] text-base-700"
      >
        {topEditorialLinks.map((item, index) => (
          <span key={item.href} className="inline-flex items-center gap-1.5">
            <Link href={item.href} className="ui-link !text-[0.56rem] !tracking-[0.14em] !text-base-700">
              {item.label}
            </Link>
            {index < topEditorialLinks.length - 1 && (
              <span className="select-none text-base-500" aria-hidden="true">
                *
              </span>
            )}
          </span>
        ))}
      </nav>
    </section>
  );
}
