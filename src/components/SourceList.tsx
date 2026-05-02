import { sourceManifest } from "@/lib/generated";

export function SourceList() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sourceManifest.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
        >
          <p className="font-bold text-slate-950">{source.name}</p>
          <p className="mt-2 text-sm text-slate-600">
            School year: {source.schoolYear}. Retrieved: {new Date(source.retrievedAt).toLocaleDateString()}.
          </p>
        </a>
      ))}
    </div>
  );
}
