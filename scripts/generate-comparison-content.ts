import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { clean, GENERATED_DIR, officialSources, readJson, sourceById, sourceWithFileStats, writeJson } from "./data-utils.ts";
import type { EntityRecord, MetricRecord } from "./data-utils.ts";

type MetricBundle = { metrics: MetricRecord[] };
type EntityBundle = { entities: EntityRecord[] };

const categories = [
  "Academics",
  "Flexibility",
  "Activities",
  "Student support",
  "Accountability",
  "Community connection",
] as const;

function sortMetrics(a: MetricRecord, b: MetricRecord) {
  return `${a.entityName}-${a.metric}-${a.subject ?? ""}`.localeCompare(`${b.entityName}-${b.metric}-${b.subject ?? ""}`);
}

function bestAcademic(metrics: MetricRecord[], entityId: string) {
  return metrics
    .filter((metric) => metric.entityId === entityId && metric.category === "Academics" && typeof metric.value === "number")
    .sort((a, b) => Number(b.value) - Number(a.value))[0];
}

function metric(metrics: MetricRecord[], entityId: string, subject: string) {
  return metrics.find((item) => item.entityId === entityId && item.subject === subject && item.metric === "Percent proficient or advanced");
}

function compareSentence(parkland?: MetricRecord, other?: MetricRecord) {
  if (!parkland || typeof parkland.value !== "number") return "Parkland data is not available in the current official file for this metric.";
  if (!other || typeof other.value !== "number") return `${other?.entityName ?? "The comparison option"} is not directly comparable based on the current public data for this metric.`;
  const delta = Number((parkland.value - other.value).toFixed(1));
  if (delta > 0) {
    return `Parkland is ${delta} percentage points higher than ${other.entityName} on ${parkland.subject} in the latest official file.`;
  }
  if (delta < 0) {
    return `${other.entityName} is ${Math.abs(delta)} percentage points higher than Parkland on ${parkland.subject} in the latest official file.`;
  }
  return `Parkland and ${other.entityName} report the same ${parkland.displayValue} result on ${parkland.subject} in the latest official file.`;
}

function pageContent(slug: string, title: string, description: string, focusEntityId?: string) {
  return {
    slug,
    title,
    description,
    sections: [
      {
        heading: "What the official data shows",
        body:
          focusEntityId === "circle-of-seasons-charter-school"
            ? "Circle of Seasons and Parkland can be compared using current PDE assessment files and Future Ready fast facts. Some school-level measures are not directly comparable because Parkland is a district with multiple schools while Circle of Seasons is a single charter school."
            : "The latest official files provide assessment results, fast facts, enrollment, support indicators, and accountability labels that families can review before choosing a school option.",
      },
      {
        heading: "What parents should ask",
        body: "Ask how academics, services, activities, transportation, counseling, special education, virtual learning, and community connection work in daily practice.",
      },
      {
        heading: "How to read this comparison",
        body: "Use percentages as a starting point, then check grade span, student population, services, and whether the metric is district-level, school-level, or statewide.",
      },
    ],
  };
}

async function main() {
  const pssa = await readJson<MetricBundle>(join(GENERATED_DIR, "pssa-metrics.json"));
  const keystone = await readJson<MetricBundle>(join(GENERATED_DIR, "keystone-metrics.json"));
  const futureReady = await readJson<MetricBundle>(join(GENERATED_DIR, "future-ready-metrics.json"));
  const entities = await readJson<EntityBundle>(join(GENERATED_DIR, "entities.json"));
  const pvaHtml = await readFile(join(process.cwd(), "data/raw/program/parkland-virtual-academy.html"), "utf8").catch(() => "");

  const metrics = [...pssa.metrics, ...keystone.metrics, ...futureReady.metrics].sort(sortMetrics);
  const parklandEla = metric(metrics, "parkland-school-district", "English Language Arts");
  const circleEla = metric(metrics, "circle-of-seasons-charter-school", "English Language Arts");
  const stateEla = metric(metrics, "pa-state", "English Language Arts");
  const strongest = bestAcademic(metrics, "parkland-school-district");

  const programFacts: MetricRecord[] = [
    {
      id: "parkland-virtual-academy-local-support",
      entityId: "parkland-virtual-academy",
      entityName: "Parkland Virtual Academy",
      entityType: "program",
      category: "Flexibility",
      metric: "District-connected virtual option",
      value: pvaHtml.includes("Hybrid Learning") ? "Hybrid and online learning language appears on the public program page" : "Program page reviewed",
      displayValue: pvaHtml.includes("Hybrid Learning") ? "Hybrid/online option described" : "Program page reviewed",
      schoolYear: "2025-2026",
      sourceId: "parkland-virtual-academy-page",
      sourceName: "Parkland Virtual Academy public program page",
      sourceUrl: "https://www.parklandsd.org/schools/parkland-virtual-academy",
      note: "Program facts are drawn from the public Parkland Virtual Academy page and should be read alongside official performance data.",
    },
    {
      id: "parkland-virtual-academy-activities",
      entityId: "parkland-virtual-academy",
      entityName: "Parkland Virtual Academy",
      entityType: "program",
      category: "Activities",
      metric: "Access to district activities",
      value: pvaHtml.includes("Athletics") || pvaHtml.includes("Clubs") ? "Activities and clubs described on public program page" : "Program page reviewed",
      displayValue: pvaHtml.includes("Athletics") || pvaHtml.includes("Clubs") ? "Activities connection described" : "Program page reviewed",
      schoolYear: "2025-2026",
      sourceId: "parkland-virtual-academy-page",
      sourceName: "Parkland Virtual Academy public program page",
      sourceUrl: "https://www.parklandsd.org/schools/parkland-virtual-academy",
      note: "Families should confirm current eligibility details with Parkland before enrollment.",
    },
  ];

  const allMetrics = [...metrics, ...programFacts];
  const cyberEntities = entities.entities.filter((entity) => entity.type === "cyber");

  const summaries = [
    strongest
      ? `Parkland's strongest imported academic metric is ${strongest.subject ?? strongest.metric} at ${strongest.displayValue} in ${strongest.schoolYear}.`
      : "Parkland academic metrics are available in the official files.",
    compareSentence(parklandEla, circleEla),
    stateEla && parklandEla && typeof stateEla.value === "number" && typeof parklandEla.value === "number"
      ? `Pennsylvania statewide ${stateEla.subject} is ${stateEla.displayValue}; Parkland reports ${parklandEla.displayValue} for the same subject in the imported PSSA file.`
      : "Statewide comparison data is shown where the current official file supports it.",
    `${cyberEntities.length} Pennsylvania cyber charter entities are included from Future Ready fast facts for category-level comparison.`,
  ];

  await writeJson(join(GENERATED_DIR, "all-metrics.json"), {
    generatedAt: new Date().toISOString(),
    categories,
    metrics: allMetrics,
  });

  await writeJson(join(GENERATED_DIR, "comparison-content.json"), {
    generatedAt: new Date().toISOString(),
    summaries,
    pages: [
      pageContent("alternatives-to-parkland-school-district", "Alternatives to Parkland School District", "Compare Parkland with charter, cyber charter, private, and alternative options using official data."),
      pageContent("parkland-vs-charter-schools", "Parkland School District vs charter school", "Compare district and charter options with academic, support, accountability, and community data."),
      pageContent("parkland-vs-cyber-charter", "Cyber charter vs Parkland", "Compare online flexibility, official cyber charter data, and Parkland Virtual Academy."),
      pageContent("parkland-virtual-academy", "Parkland Virtual Academy", "Explore Parkland Virtual Academy as a flexible district-connected option."),
      pageContent("circle-of-seasons-vs-parkland", "Parkland vs Circle of Seasons", "Compare Circle of Seasons Charter School and Parkland using public official files.", "circle-of-seasons-charter-school"),
      pageContent("compare", "Compare Parkland education options", "Filter official metrics by academics, flexibility, support, activities, accountability, and community connection."),
    ],
  });

  await writeJson(join(GENERATED_DIR, "source-manifest.json"), {
    generatedAt: new Date().toISOString(),
    sources: officialSources.map(sourceWithFileStats),
  });

  const missingCitations = allMetrics.filter((item) => !item.sourceId || !sourceById(item.sourceId));
  if (missingCitations.length > 0) {
    throw new Error(`Metrics missing citations: ${missingCitations.map((item) => item.id).join(", ")}`);
  }

  console.log(`Generated comparison content with ${allMetrics.length} visible metrics`);
  console.log(summaries.map((summary) => `- ${clean(summary)}`).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
