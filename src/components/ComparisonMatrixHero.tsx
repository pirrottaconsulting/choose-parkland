"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { comparisonRows, sourceDocuments } from "@/lib/generated";

type Cell = {
  status:
    | "included"
    | "strong"
    | "numeric"
    | "not_applicable"
    | "not_directly_comparable"
    | "verify"
    | "not_publicly_available";
  value: string;
  detail: string;
  sourceIds: string[];
};

type Entity = (typeof comparisonRows.entities)[number];
type Row = (typeof comparisonRows.rows)[number];

const categoryFilters = ["Best overall", "Outcomes", "Flexibility", "High school depth", "Activities", "Support"] as const;

const categoryMap: Record<string, string[]> = {
  "Best overall": ["Outcomes", "Academics", "Flexibility", "High school depth", "Activities", "Student support", "Community"],
  Outcomes: ["Outcomes", "Academics"],
  Flexibility: ["Flexibility"],
  "High school depth": ["High school depth", "Facilities"],
  Activities: ["Activities"],
  Support: ["Student support"],
};

const rowLimits: Record<string, number> = {
  "Best overall": 11,
  Outcomes: 8,
  Flexibility: 8,
  "High school depth": 8,
  Activities: 8,
  Support: 8,
};

function sourceTitle(ids: string[]) {
  return ids
    .map((id) => sourceDocuments.find((source) => source.id === id))
    .filter(Boolean)
    .map((source) => `${source?.name}: ${source?.url}`)
    .join("\n");
}

function sourceChip(ids: string[]) {
  const first = sourceDocuments.find((source) => source.id === ids[0]);
  if (!first) return "Source";
  if (first.name.includes("PSSA")) return "PDE PSSA";
  if (first.name.includes("Keystone")) return "PDE Keystone";
  if (first.name.includes("Graduation")) return "PDE Grad";
  if (first.name.includes("Future Ready")) return "Future Ready";
  if (first.name.includes("Parkland")) return "Parkland";
  if (first.name.includes("Circle")) return "Circle";
  return "Source";
}

function cellFor(row: Row, entityId: string): Cell {
  if (entityId === "parkland-school-district" || entityId === "parkland-virtual-academy") return row.parklandCell as Cell;
  return (row.comparatorRules.find((rule) => rule.entityId === entityId)?.cell ?? {
    status: "verify",
    value: "Verify directly",
    detail: "Public source data is insufficient for a direct comparison.",
    sourceIds: row.sourceIds,
  }) as Cell;
}

function iconFor(status: Cell["status"]) {
  if (status === "numeric") return "#";
  if (status === "not_applicable") return "N/A";
  if (status === "not_directly_comparable") return "~";
  if (status === "verify" || status === "not_publicly_available") return "i";
  return "✓";
}

function entityById(id: string) {
  return comparisonRows.entities.find((entity) => entity.id === id);
}

export function ComparisonMatrixHero({
  pageKey = "home",
  fixedEntityId = "parkland-school-district",
  heading = "Compare what Parkland already includes.",
  subheading = "Before choosing a charter, cyber charter, or alternative school, see how Parkland's academics, virtual flexibility, activities, support services, and local community compare.",
  defaultCategory = "Best overall",
  compact = false,
}: {
  pageKey?: keyof typeof comparisonRows.pageDefaults | string;
  fixedEntityId?: string;
  heading?: string;
  subheading?: string;
  defaultCategory?: (typeof categoryFilters)[number];
  compact?: boolean;
}) {
  const pageDefaults = (comparisonRows.pageDefaults as Record<string, string[]>)[pageKey] ?? comparisonRows.pageDefaults.home;
  const fixedEntity = entityById(fixedEntityId) ?? entityById("parkland-school-district");
  const initialSelected = pageDefaults.filter((id) => id !== fixedEntity?.id).slice(0, 3);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [pending, setPending] = useState(
    comparisonRows.entities.find((entity) => entity.id !== fixedEntity?.id && !initialSelected.includes(entity.id) && entity.id !== "parkland-virtual-academy")?.id ?? "",
  );

  const selectedEntities = useMemo(
    () => [fixedEntity, ...selected.map(entityById)].filter(Boolean) as Entity[],
    [fixedEntity, selected],
  );
  const available = comparisonRows.entities.filter(
    (entity) => entity.id !== fixedEntity?.id && !selected.includes(entity.id) && !(pageKey === "home" && entity.id === "parkland-virtual-academy"),
  );
  const visibleRows = comparisonRows.rows
    .filter((row) => categoryMap[category]?.includes(row.category))
    .filter((row) => row.parklandCell.status !== "not_publicly_available")
    .slice(0, rowLimits[category] ?? 10);

  function addComparison() {
    if (!pending || selected.includes(pending)) return;
    setSelected((items) => [...items, pending].slice(0, 4));
    setPending(available.find((entity) => entity.id !== pending)?.id ?? "");
  }

  function swap(current: string, next: string) {
    setSelected((items) => items.map((id) => (id === current ? next : id)));
  }

  return (
    <section data-component="ComparisonMatrixHero" className="relative overflow-hidden bg-[#f6faf8]">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#0f766e] via-[#2563eb] to-[#f59e0b]" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">Choose Parkland</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">{heading}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">{subheading}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#comparison-matrix" className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-black text-white">
                Build your comparison
              </a>
              <Link href="/parkland-virtual-academy" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-black text-slate-950">
                Explore Parkland Virtual Academy
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">Parkland column includes:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {fixedEntity?.chips?.map((chip) => (
                <span key={chip} className="rounded-md bg-[#e7f5ef] px-3 py-1 text-xs font-black text-[#0f766e]">{chip}</span>
              ))}
            </div>
          </div>
        </div>

        <div id="comparison-matrix" className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Comparison selector</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryFilters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={item === category ? "rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white" : "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700"}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select value={pending} onChange={(event) => setPending(event.target.value)} className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800">
                {available.map((entity) => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
              <button type="button" onClick={addComparison} className="h-11 rounded-lg bg-[#0f766e] px-4 text-sm font-black text-white">
                Add comparison
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[1020px]" style={{ gridTemplateColumns: `250px repeat(${selectedEntities.length}, minmax(220px, 1fr))` }}>
              <div className="border-b border-r border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-black text-slate-950">Parent question</p>
              </div>
              {selectedEntities.map((entity) => {
                const highlighted = entity.id === fixedEntity?.id;
                return (
                  <div key={entity.id} className={highlighted ? "border-b border-r border-slate-800 bg-slate-950 p-5 text-white" : "border-b border-r border-slate-200 bg-white p-5"}>
                    <div className="flex min-h-40 flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-black tracking-tight">{entity.name}</h2>
                          {highlighted ? <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-950">Recommended</span> : null}
                        </div>
                        <p className={highlighted ? "mt-2 text-sm font-bold text-slate-300" : "mt-2 text-sm font-bold text-slate-500"}>{entity.badge}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {entity.chips?.slice(0, highlighted ? 5 : 3).map((chip) => (
                            <span key={chip} className={highlighted ? "rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold text-white" : "rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600"}>{chip}</span>
                          ))}
                        </div>
                      </div>
                      {!highlighted ? (
                        <select value={entity.id} onChange={(event) => swap(entity.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm font-bold text-slate-800">
                          {[entity, ...available].map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                        </select>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {visibleRows.map((row) => (
                <div key={row.id} className="contents">
                  <div className="border-b border-r border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-950">{row.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{row.parentQuestion}</p>
                    <span title={sourceTitle(row.sourceIds)} className="mt-3 inline-flex rounded-md bg-white px-2 py-1 text-[11px] font-black text-slate-500 ring-1 ring-slate-200">
                      {sourceChip(row.sourceIds)}
                    </span>
                  </div>
                  {selectedEntities.map((entity) => {
                    const highlighted = entity.id === fixedEntity?.id;
                    const cell = cellFor(row, entity.id);
                    const muted = ["not_applicable", "not_directly_comparable", "verify", "not_publicly_available"].includes(cell.status);
                    return (
                      <div key={`${row.id}-${entity.id}`} className={highlighted ? "border-b border-r border-slate-800 bg-slate-950 p-4 text-white" : "border-b border-r border-slate-200 bg-white p-4"}>
                        <div className="flex gap-3">
                          <span className={muted ? "mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1 text-[10px] font-black text-slate-500" : highlighted ? "mt-0.5 flex size-6 items-center justify-center rounded-full bg-white text-xs font-black text-slate-950" : "mt-0.5 flex size-6 items-center justify-center rounded-full bg-[#0f766e] text-xs font-black text-white"}>
                            {iconFor(cell.status)}
                          </span>
                          <div>
                            <p className={muted ? "text-sm font-black leading-6 text-slate-500" : "text-base font-black leading-6"}>{cell.value}</p>
                            {!compact ? <p className={highlighted ? "mt-1 text-xs leading-5 text-slate-300" : "mt-1 text-xs leading-5 text-slate-500"}>{cell.detail}</p> : null}
                            <span title={sourceTitle(cell.sourceIds)} className={highlighted ? "mt-2 inline-flex rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold text-slate-200" : "mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500"}>
                              {sourceChip(cell.sourceIds)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
