import { futureReadyMetrics, pssaResults } from "@/data";
import { SourceNote } from "./SourceNote";

export function DataCallouts() {
  const items = [
    {
      label: "PSSA and Keystone",
      value: "Pending ingestion",
      description:
        "School-level rows will be populated from official PDE files when the parser is added.",
      sourceIds: pssaResults[0].sourceIds,
    },
    {
      label: "Future Ready PA",
      value: "Latest available data",
      description:
        "The weekly monitor checks the official data-files page for updates and records changes.",
      sourceIds: futureReadyMetrics[0].sourceIds,
    },
    {
      label: "Program information",
      value: "Verify before deciding",
      description:
        "Virtual, charter, and alternative program details should be confirmed with each school.",
      sourceIds: ["parkland-virtual-academy", "circle-of-seasons-public-info"],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{item.value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          <SourceNote sourceIds={item.sourceIds} />
        </div>
      ))}
    </div>
  );
}
