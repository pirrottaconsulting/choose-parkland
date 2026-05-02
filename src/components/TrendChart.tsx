import { allMetrics } from "@/lib/generated";

export function TrendChart({ entityId, subject }: { entityId: string; subject: string }) {
  const points = allMetrics
    .filter((metric) => metric.entityId === entityId && metric.subject === subject && typeof metric.value === "number")
    .sort((a, b) => a.schoolYear.localeCompare(b.schoolYear));

  if (points.length < 2) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-600">
        A multi-year trend is not directly comparable based on the imported official files. The current visible value is{" "}
        <strong className="text-slate-950">{points[0]?.displayValue ?? "not available"}</strong> for {subject}.
      </div>
    );
  }

  const max = Math.max(...points.map((point) => Number(point.value)));
  const min = Math.min(...points.map((point) => Number(point.value)));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <svg viewBox="0 0 320 120" className="h-36 w-full">
        <polyline
          fill="none"
          stroke="#0f766e"
          strokeWidth="4"
          points={points
            .map((point, index) => {
              const x = (index / Math.max(points.length - 1, 1)) * 300 + 10;
              const y = 110 - ((Number(point.value) - min) / Math.max(max - min, 1)) * 90;
              return `${x},${y}`;
            })
            .join(" ")}
        />
      </svg>
    </div>
  );
}
