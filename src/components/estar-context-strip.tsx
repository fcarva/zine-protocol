import Link from "next/link";

const items = [
  { href: "/", label: "Visitar arquivo" },
  { href: "/checkout", label: "Store de apoio" },
  { href: "/curadoria", label: "Curadoria" },
  { href: "/ensino", label: "Ensino" },
  { href: "/recursos", label: "Recursos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/manifesto", label: "Espaco editorial" },
];

export function EstarContextStrip() {
  return (
    <section className="border-y border-base-300 py-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-base-700">
        {items.map((item, index) => (
          <span key={item.href} className="inline-flex items-center gap-2">
            {index > 0 && <span className="text-base-500">*</span>}
            <Link href={item.href} className="ui-link !text-[0.56rem] !tracking-[0.16em]">
              {item.label}
            </Link>
          </span>
        ))}
      </div>
    </section>
  );
}
