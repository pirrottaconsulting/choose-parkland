import { ComparisonCriterion } from "@/data";
import { SourceNote } from "./SourceNote";

export function ComparisonCard({ criterion }: { criterion: ComparisonCriterion }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
        {criterion.label}
      </p>
      <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
        {criterion.parentQuestion}
      </h3>
      <div className="mt-5 grid gap-4 text-sm leading-6 text-slate-600">
        <div>
          <p className="font-semibold text-slate-950">Parkland lens</p>
          <p className="mt-1">{criterion.parklandFrame}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Other options lens</p>
          <p className="mt-1">{criterion.alternativeFrame}</p>
        </div>
      </div>
      <SourceNote sourceIds={criterion.sourceIds} />
    </article>
  );
}
