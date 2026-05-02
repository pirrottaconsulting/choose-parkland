"use client";

import { useMemo, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { allMetrics, categories, primaryEntities } from "@/lib/generated";

export function ComparisonExplorer({ limit = 18 }: { limit?: number }) {
  const [category, setCategory] = useState<string>("Academics");

  const filtered = useMemo(
    () =>
      allMetrics
        .filter((metric) => metric.category === category)
        .filter((metric) => primaryEntities.includes(metric.entityId) || metric.entityType === "program")
        .slice(0, limit),
    [category, limit],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={
              item === category
                ? "rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                : "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"
            }
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {filtered.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
          Data is not directly comparable based on the current public files for this category.
        </div>
      )}
    </div>
  );
}
