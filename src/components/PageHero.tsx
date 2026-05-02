import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryHref = "/compare",
  primaryLabel = "Compare your options",
}: PageHeroProps) {
  return (
    <section className="bg-[#f7fbf8]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0f766e]">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
            >
              {primaryLabel}
            </Link>
            <Link
              href="/parkland-virtual-academy"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 hover:border-slate-400"
            >
              Explore Parkland Virtual Academy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
