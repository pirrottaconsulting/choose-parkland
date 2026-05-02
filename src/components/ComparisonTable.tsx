import { comparisonCriteria } from "@/data";
import { SourceNote } from "./SourceNote";

export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 border-b border-slate-200 bg-slate-50 text-sm font-bold text-slate-950 md:grid-cols-[0.75fr_1fr_1fr]">
        <div className="p-4">Decision area</div>
        <div className="p-4">Parkland question</div>
        <div className="p-4">Question for alternatives</div>
      </div>
      {comparisonCriteria.map((criterion) => (
        <div
          key={criterion.id}
          className="grid grid-cols-1 border-b border-slate-100 last:border-b-0 md:grid-cols-[0.75fr_1fr_1fr]"
        >
          <div className="p-4">
            <p className="font-semibold text-slate-950">{criterion.label}</p>
            <SourceNote sourceIds={criterion.sourceIds} />
          </div>
          <p className="p-4 text-sm leading-6 text-slate-600">{criterion.parklandFrame}</p>
          <p className="p-4 text-sm leading-6 text-slate-600">{criterion.alternativeFrame}</p>
        </div>
      ))}
    </div>
  );
}
