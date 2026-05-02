import allMetricsData from "@/data/generated/all-metrics.json";
import comparisonContentData from "@/data/generated/comparison-content.json";
import entitiesData from "@/data/generated/entities.json";
import sourceManifestData from "@/data/generated/source-manifest.json";

export type Metric = (typeof allMetricsData.metrics)[number];
export type Entity = (typeof entitiesData.entities)[number];
export type Source = (typeof sourceManifestData.sources)[number];

export const allMetrics = allMetricsData.metrics as Metric[];
export const categories = allMetricsData.categories;
export const entities = entitiesData.entities as Entity[];
export const sourceManifest = sourceManifestData.sources as Source[];
export const comparisonContent = comparisonContentData;

export function sourceForMetric(metric: Metric) {
  return sourceManifest.find((source) => source.id === metric.sourceId);
}

export function metricsForEntity(entityId: string) {
  return allMetrics.filter((metric) => metric.entityId === entityId);
}

export function metricsForCategory(category: string) {
  return allMetrics.filter((metric) => metric.category === category);
}

export function topAcademicMetrics(limit = 6) {
  return allMetrics
    .filter((metric) => metric.category === "Academics" && typeof metric.value === "number")
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, limit);
}

export function metricBy(entityId: string, metricName: string, subject?: string) {
  return allMetrics.find(
    (metric) =>
      metric.entityId === entityId &&
      metric.metric === metricName &&
      (!subject || metric.subject === subject),
  );
}

export function formatNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string" && value.length > 0) return value;
  return "Not available in the current official file";
}

export function pageBySlug(slug: string) {
  return comparisonContent.pages.find((page) => page.slug === slug);
}

export const primaryEntities = [
  "parkland-school-district",
  "parkland-high-school",
  "circle-of-seasons-charter-school",
  "commonwealth-charter-academy-cs",
  "agora-cyber-cs",
  "21st-century-cyber-cs",
];
