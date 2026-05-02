import { allMetrics, primaryEntities, sourceForMetric } from "@/lib/generated";

export function DataTable({ entityIds = primaryEntities }: { entityIds?: string[] }) {
  const rows = allMetrics
    .filter((metric) => entityIds.includes(metric.entityId))
    .filter((metric) => ["Academics", "Student support", "Accountability"].includes(metric.category))
    .slice(0, 40);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((metric) => {
              const source = sourceForMetric(metric);
              return (
                <tr key={metric.id}>
                  <td className="px-4 py-3 font-semibold text-slate-950">{metric.entityName}</td>
                  <td className="px-4 py-3 text-slate-600">{metric.category}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {metric.metric}
                    {metric.subject ? `: ${metric.subject}` : ""}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-950">{metric.displayValue}</td>
                  <td className="px-4 py-3 text-slate-600">{metric.schoolYear}</td>
                  <td className="px-4 py-3">
                    <a href={metric.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#0f766e]">
                      Source: {source?.name ?? metric.sourceName}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
