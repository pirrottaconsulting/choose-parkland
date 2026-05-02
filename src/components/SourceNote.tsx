import { getSourceById } from "@/data";

export function SourceNote({ sourceIds }: { sourceIds: string[] }) {
  const sources = sourceIds.map((id) => getSourceById(id));

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {sources.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950"
          title={source.notes}
        >
          {source.label}
        </a>
      ))}
    </div>
  );
}
