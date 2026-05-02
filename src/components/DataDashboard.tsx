import { MetricCard } from "@/components/MetricCard";
import { entities, metricBy, topAcademicMetrics } from "@/lib/generated";
import type { Metric } from "@/lib/generated";

function isMetric(metric: Metric | undefined): metric is Metric {
  return Boolean(metric);
}

export function DataDashboard() {
  const parkland = entities.find((entity) => entity.id === "parkland-school-district");
  const circle = entities.find((entity) => entity.id === "circle-of-seasons-charter-school");
  const dashboardMetrics = [
    metricBy("parkland-school-district", "Percent proficient or advanced", "English Language Arts"),
    metricBy("parkland-school-district", "Percent proficient or advanced", "Mathematics"),
    metricBy("parkland-school-district", "Percent proficient or advanced", "Science"),
    metricBy("parkland-school-district", "Percent proficient or advanced", "Algebra I"),
    metricBy("circle-of-seasons-charter-school", "Percent proficient or advanced", "English Language Arts"),
    metricBy("pa-state", "Percent proficient or advanced", "English Language Arts"),
  ].filter(isMetric);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Parkland district enrollment</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {parkland?.enrollment?.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-600">Future Ready District Fast Facts</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Circle of Seasons enrollment</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {circle?.enrollment?.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-600">Future Ready School Fast Facts</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Highest imported Parkland metric</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {topAcademicMetrics(1)[0]?.displayValue}
          </p>
          <p className="mt-2 text-sm text-slate-600">{topAcademicMetrics(1)[0]?.metric}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
