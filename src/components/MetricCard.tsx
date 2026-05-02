import { Metric, sourceForMetric } from "@/lib/generated";

export function MetricCard({ metric }: { metric: Metric }) {
  const source = sourceForMetric(metric);
  const comparison =
    typeof metric.comparisonValue === "number"
      ? `${Number(metric.comparisonValue).toFixed(1).replace(/\.0$/, "")}% ${metric.comparisonLabel ?? "comparison"}`
      : metric.comparisonValue;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f766e]">
            {metric.category}
          </p>
          <h3 className="mt-2 text-base font-bold text-slate-950">{metric.entityName}</h3>
        </div>
        <p className="rounded-lg bg-slate-950 px-3 py-2 text-lg font-black text-white">
          {metric.displayValue}
        </p>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800">
        {metric.metric}
        {metric.subject ? `: ${metric.subject}` : ""}
      </p>
      {comparison ? <p className="mt-2 text-sm text-slate-600">Comparison: {comparison}</p> : null}
      {metric.note ? <p className="mt-2 text-xs leading-5 text-slate-500">{metric.note}</p> : null}
      <a
        href={metric.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex text-xs font-semibold text-[#0f766e] underline-offset-4 hover:underline"
      >
        Source: {source?.name ?? metric.sourceName}
      </a>
    </article>
  );
}
