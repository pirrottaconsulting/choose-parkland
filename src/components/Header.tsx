import Link from "next/link";

const navItems = [
  { href: "/compare", label: "Compare" },
  { href: "/best-education-options-in-parkland-school-district", label: "Options" },
  { href: "/parkland-virtual-academy", label: "Virtual Academy" },
  { href: "/parkland-vs-charter-schools", label: "Charters" },
  { href: "/parkland-vs-cyber-charter", label: "Cyber charter" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-[#0f766e] text-sm font-black text-white">
            CP
          </span>
          <span className="text-base font-bold tracking-tight text-slate-950">
            Choose Parkland
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/compare"
          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Compare options
        </Link>
      </div>
    </header>
  );
}
