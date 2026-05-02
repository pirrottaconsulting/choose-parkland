import Link from "next/link";
import { lastUpdated, sourceDocuments } from "@/data";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="font-semibold text-slate-950">Choose Parkland</p>
          <p className="mt-3 max-w-2xl">
            This site uses publicly available data from official sources where available.
            Performance data is updated when official state sources publish new files.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Site content last updated: {lastUpdated.siteContent}. {lastUpdated.disclaimer}
          </p>
        </div>
        <div className="grid gap-2">
          <p className="font-semibold text-slate-950">Official source targets</p>
          {sourceDocuments.slice(0, 3).map((source) => (
            <a
              key={source.id}
              href={source.url}
              className="text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {source.label}
            </a>
          ))}
          <Link href="/compare" className="mt-2 font-semibold text-[#0f766e]">
            See comparison framework
          </Link>
        </div>
      </div>
    </footer>
  );
}
