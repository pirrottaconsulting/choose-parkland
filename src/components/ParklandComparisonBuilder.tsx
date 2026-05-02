"use client";

import { useMemo, useState } from "react";
import { comparisonMatrix } from "@/lib/generated";

const lockedEntityId = "parkland-school-district";
const initialComparisons = comparisonMatrix.entities
  .filter((entity) => entity.defaultSelected)
  .map((entity) => entity.id);

type MatrixValue = {
  displayValue: string;
  status?: string;
  sourceName?: string;
  sourceUrl?: string;
  schoolYear?: string;
  note?: string;
};

function sourceLabel(value: MatrixValue) {
  const year = value.schoolYear ? `, ${value.schoolYear}` : "";
  return `${value.sourceName ?? "Official source"}${year}`;
}

export function ParklandComparisonBuilder() {
  const [category, setCategory] = useState("Academics");
  const [selected, setSelected] = useState<string[]>(initialComparisons);
  const [pending, setPending] = useState(
    comparisonMatrix.entities.find((entity) => !entity.locked && !initialComparisons.includes(entity.id))?.id ?? "",
  );

  const selectedEntities = useMemo(
    () => [
      comparisonMatrix.entities.find((entity) => entity.id === lockedEntityId),
      ...selected.map((id) => comparisonMatrix.entities.find((entity) => entity.id === id)),
    ].filter(Boolean),
    [selected],
  );

  const available = comparisonMatrix.entities.filter((entity) => !entity.locked && !selected.includes(entity.id));
  const rows = comparisonMatrix.rows.filter((row) => row.category === category);

  function addComparison() {
    if (!pending || selected.includes(pending)) return;
    setSelected((items) => [...items, pending].slice(0, 4));
    const next = available.find((entity) => entity.id !== pending);
    setPending(next?.id ?? "");
  }

  function swapComparison(current: string, next: string) {
    if (!next || current === next) return;
    setSelected((items) => items.map((id) => (id === current ? next : id)));
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f766e]">Interactive comparison</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Parkland stays on the left. Add options to the right.</h3>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={pending}
              onChange={(event) => setPending(event.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0f766e]"
            >
              {available.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addComparison}
              disabled={!pending || selected.length >= 4}
              className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add comparison
            </button>
          </div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {comparisonMatrix.categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                item === category
                  ? "whitespace-nowrap rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-bold text-white"
                  : "whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[980px]"
          style={{ gridTemplateColumns: `270px repeat(${selectedEntities.length}, minmax(230px, 1fr))` }}
        >
          <div className="border-b border-r border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Compare by</p>
            <p className="mt-2 text-lg font-black text-slate-950">{category}</p>
          </div>
          {selectedEntities.map((entity, index) => {
            if (!entity) return null;
            const isParkland = entity.id === lockedEntityId;
            return (
              <div
                key={entity.id}
                className={
                  isParkland
                    ? "border-b border-r border-slate-800 bg-slate-950 p-5 text-white"
                    : "border-b border-r border-slate-200 bg-white p-5"
                }
              >
                <div className="flex min-h-24 flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-2xl font-black tracking-tight">{entity.name}</h4>
                      {isParkland ? (
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-950">Fixed</span>
                      ) : null}
                    </div>
                    <p className={isParkland ? "mt-2 text-sm font-semibold text-slate-300" : "mt-2 text-sm font-semibold text-slate-500"}>
                      {entity.label}
                    </p>
                  </div>
                  {!isParkland ? (
                    <div className="flex gap-2">
                      <select
                        aria-label={`Change ${entity.name}`}
                        value={entity.id}
                        onChange={(event) => swapComparison(entity.id, event.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm font-semibold text-slate-800"
                      >
                        {[entity, ...available].map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      {index > 1 ? (
                        <button
                          type="button"
                          onClick={() => setSelected((items) => items.filter((id) => id !== entity.id))}
                          className="rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <a href="/compare" className="rounded-lg bg-white px-4 py-3 text-center text-sm font-black text-slate-950">
                      Compare your options
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {rows.map((row) => (
            <div key={row.id} className="contents">
              <div className="border-b border-r border-slate-200 bg-slate-50 p-5">
                <p className="text-base font-black text-slate-950">{row.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{row.context}</p>
              </div>
              {selectedEntities.map((entity) => {
                if (!entity) return null;
                const values = row.values as Record<string, MatrixValue>;
                const value = values[entity.id];
                const isParkland = entity.id === lockedEntityId;
                const missing = value?.status === "missing";
                return (
                  <div
                    key={`${row.id}-${entity.id}`}
                    className={
                      isParkland
                        ? "border-b border-r border-slate-800 bg-slate-950 p-5 text-white"
                        : "border-b border-r border-slate-200 bg-white p-5"
                    }
                  >
                    <div className="flex gap-3">
                      <span
                        className={
                          missing
                            ? "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-500"
                            : isParkland
                              ? "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-slate-950"
                              : "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-xs font-black text-white"
                        }
                      >
                        {missing ? "i" : "✓"}
                      </span>
                      <div className="min-w-0">
                        <p className={missing ? "text-sm font-bold leading-6 text-slate-500" : "text-base font-black leading-6"}>
                          {value?.displayValue ?? "Not available in the current official file"}
                        </p>
                        {value?.note ? (
                          <p className={isParkland ? "mt-2 text-xs leading-5 text-slate-300" : "mt-2 text-xs leading-5 text-slate-500"}>{value.note}</p>
                        ) : null}
                        <a
                          href={value?.sourceUrl ?? "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting"}
                          className={
                            isParkland
                              ? "mt-3 block text-xs font-semibold leading-5 text-slate-300 underline decoration-slate-500 underline-offset-4"
                              : "mt-3 block text-xs font-semibold leading-5 text-slate-500 underline decoration-slate-300 underline-offset-4"
                          }
                        >
                          Source: {sourceLabel(value ?? {})}
                        </a>
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
  );
}
