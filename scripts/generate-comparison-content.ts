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
  const graduation = await readJson<MetricBundle>(join(GENERATED_DIR, "graduation-metrics.json"));
  const entities = await readJson<EntityBundle>(join(GENERATED_DIR, "entities.json"));
  const pvaHtml = await readFile(join(process.cwd(), "data/raw/program/parkland-virtual-academy.html"), "utf8").catch(() => "");

  const metrics = [...pssa.metrics, ...keystone.metrics, ...futureReady.metrics, ...graduation.metrics].sort(sortMetrics);
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

  const sourceMap = new Map(officialSources.map((source) => [source.id, source]));
  const entityMap = new Map(entities.entities.map((entity) => [entity.id, entity]));
  const matrixEntities = [
    { id: "parkland-school-district", name: "Parkland School District", label: "Your local public district", type: "district", locked: true },
    { id: "circle-of-seasons-charter-school", name: "Circle of Seasons CS", label: "Local charter option", type: "charter", defaultSelected: true },
    { id: "parkland-virtual-academy", name: "Parkland Virtual Academy", label: "District-connected virtual option", type: "program", defaultSelected: true },
    { id: "commonwealth-charter-academy-cs", name: "Commonwealth Charter Academy CS", label: "Cyber charter option", type: "cyber" },
    { id: "agora-cyber-cs", name: "Agora Cyber CS", label: "Cyber charter option", type: "cyber" },
    { id: "21st-century-cyber-cs", name: "21st Century Cyber CS", label: "Cyber charter option", type: "cyber" },
    { id: "pa-state", name: "Pennsylvania statewide", label: "Statewide benchmark", type: "state" },
  ];

  function sourcedValue(metric?: MetricRecord, fallback = "Not available in the current official file") {
    if (!metric) {
      return {
        displayValue: fallback,
        status: "missing",
        sourceName: "Current generated data",
        sourceUrl: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
        schoolYear: "Latest official data available",
      };
    }
    return {
      displayValue: metric.displayValue,
      rawValue: metric.value,
      status: metric.value === null ? "missing" : "available",
      sourceId: metric.sourceId,
      sourceName: metric.sourceName,
      sourceUrl: metric.sourceUrl,
      schoolYear: metric.schoolYear,
      note: metric.note,
    };
  }

  function factValue(entityId: string, label: string) {
    const entity = entityMap.get(entityId);
    const fact = entity?.facts.find((item) => item.label === label);
    if (!fact) return sourcedValue(undefined);
    const source = sourceMap.get(fact.sourceId);
    return {
      displayValue: fact.value || "Not available in the current official file",
      rawValue: fact.value,
      status: fact.value ? "available" : "missing",
      sourceId: fact.sourceId,
      sourceName: source?.name ?? "Official source",
      sourceUrl: source?.url ?? "https://futurereadypa.org/",
      schoolYear: source?.schoolYear ?? "Latest official data available",
    };
  }

  function latestMetric(entityId: string, selector: (metric: MetricRecord) => boolean) {
    return allMetrics
      .filter((item) => item.entityId === entityId && selector(item))
      .sort((a, b) => b.schoolYear.localeCompare(a.schoolYear))[0];
  }

  function academicValue(entityId: string, pssaSubject: string, futureReadyMetric: string) {
    return sourcedValue(
      latestMetric(
        entityId,
        (item) =>
          (item.metric === "Percent proficient or advanced" && item.subject === pssaSubject) ||
          item.metric === futureReadyMetric,
      ),
    );
  }

  function keystoneValue(entityId: string, subject: string, year = "2025") {
    return sourcedValue(
      latestMetric(
        entityId,
        (item) =>
          item.metric === "Percent proficient or advanced" &&
          item.subject === subject &&
          item.schoolYear === year &&
          item.sourceId.includes("keystone"),
      ),
    );
  }

  function graduationValue(entityId: string) {
    return sourcedValue(latestMetric(entityId, (item) => item.metric === "4-year cohort graduation rate"));
  }

  function manualValue(displayValue: string, sourceId: string, note?: string) {
    const source = sourceById(sourceId);
    return {
      displayValue,
      rawValue: displayValue,
      status: "available",
      sourceId,
      sourceName: source.name,
      sourceUrl: source.url,
      schoolYear: source.schoolYear,
      note,
    };
  }

  function unavailable(displayValue = "Not directly comparable based on public data") {
    return {
      displayValue,
      status: "missing",
      sourceName: "Current public data review",
      sourceUrl: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
      schoolYear: "Latest official data available",
    };
  }

  const valuesFor = (resolver: (entityId: string) => unknown) =>
    Object.fromEntries(matrixEntities.map((entity) => [entity.id, resolver(entity.id)]));

  await writeJson(join(GENERATED_DIR, "comparison-matrix.json"), {
    generatedAt: new Date().toISOString(),
    categories,
    entities: matrixEntities,
    rows: [
      {
        id: "school-type",
        category: "Community connection",
        label: "Option type",
        context: "Helps families compare district, charter, cyber charter, and statewide benchmark rows.",
        values: valuesFor((entityId) => {
          const entity = matrixEntities.find((item) => item.id === entityId);
          return manualValue(entity?.label ?? "Education option", entityId === "parkland-virtual-academy" ? "parkland-virtual-academy-page" : "future-ready-school-fast-facts-2024-2025");
        }),
      },
      {
        id: "enrollment",
        category: "Community connection",
        label: "Enrollment",
        context: "Enrollment is shown from Future Ready fast facts where available.",
        values: valuesFor((entityId) =>
          entityId === "parkland-virtual-academy"
            ? unavailable("Program enrollment is not separately reported in the current official files")
            : factValue(entityId, entityId === "parkland-school-district" ? "District enrollment" : "Enrollment"),
        ),
      },
      {
        id: "grades-offered",
        category: "Community connection",
        label: "Grades offered",
        context: "Grade span affects which assessments and services are directly comparable.",
        values: valuesFor((entityId) =>
          entityId === "pa-state"
            ? unavailable("Statewide benchmark")
            : entityId === "parkland-virtual-academy"
              ? manualValue("District virtual pathway; confirm current grade eligibility with Parkland", "parkland-virtual-academy-page")
              : factValue(entityId, "Grades offered"),
        ),
      },
      {
        id: "virtual-flexibility",
        category: "Flexibility",
        label: "Virtual learning path",
        context: "Compares online flexibility without assuming every online option works the same way.",
        values: valuesFor((entityId) => {
          if (entityId === "parkland-school-district") return manualValue("Parkland Virtual Academy available as district-connected pathway", "parkland-virtual-academy-page");
          if (entityId === "parkland-virtual-academy") return manualValue("Virtual option connected to Parkland district resources", "parkland-virtual-academy-page");
          if (["commonwealth-charter-academy-cs", "agora-cyber-cs", "21st-century-cyber-cs"].includes(entityId)) return manualValue("Cyber charter option", "future-ready-school-fast-facts-2024-2025");
          return unavailable();
        }),
      },
      {
        id: "activities-connection",
        category: "Activities",
        label: "Activities and local connection",
        context: "Program pages and district information should be reviewed for eligibility details.",
        values: valuesFor((entityId) => {
          if (entityId === "parkland-school-district") return manualValue("District athletics, arts, clubs, and school community", "parkland-virtual-academy-page");
          if (entityId === "parkland-virtual-academy") return manualValue("Activities connection described on Parkland program page", "parkland-virtual-academy-page", "Families should confirm current eligibility details with Parkland.");
          if (entityId === "pa-state") return unavailable("Not applicable");
          return unavailable("Verify with the individual school");
        }),
      },
      {
        id: "ela-literature",
        category: "Academics",
        label: "ELA / literature proficiency",
        context: "Uses PSSA ELA where available; otherwise uses Future Ready ELA/literature.",
        values: valuesFor((entityId) => academicValue(entityId, "English Language Arts", "Future Ready ELA/literature proficiency")),
      },
      {
        id: "math-algebra",
        category: "Academics",
        label: "Math / algebra proficiency",
        context: "Uses PSSA math where available; otherwise uses Future Ready math/algebra.",
        values: valuesFor((entityId) => academicValue(entityId, "Math", "Future Ready math/algebra proficiency")),
      },
      {
        id: "science-biology",
        category: "Academics",
        label: "Science / biology proficiency",
        context: "Uses PSSA science where available; otherwise uses Future Ready science/biology.",
        values: valuesFor((entityId) => academicValue(entityId, "Science", "Future Ready science/biology proficiency")),
      },
      {
        id: "keystone-algebra-2025",
        category: "Academics",
        label: "Keystone Algebra I, grade 11",
        context: "Latest supplied PDE Keystone district or school file, all students.",
        values: valuesFor((entityId) => keystoneValue(entityId, "Algebra I", "2025")),
      },
      {
        id: "keystone-biology-2025",
        category: "Academics",
        label: "Keystone Biology, grade 11",
        context: "Latest supplied PDE Keystone district or school file, all students.",
        values: valuesFor((entityId) => keystoneValue(entityId, "Biology", "2025")),
      },
      {
        id: "keystone-literature-2025",
        category: "Academics",
        label: "Keystone Literature, grade 11",
        context: "Latest supplied PDE Keystone district or school file, all students.",
        values: valuesFor((entityId) => keystoneValue(entityId, "Literature", "2025")),
      },
      {
        id: "keystone-algebra-2024",
        category: "Academics",
        label: "Keystone Algebra I, prior year",
        context: "2024 grade 11 file supports a simple year-over-year check where comparable rows exist.",
        values: valuesFor((entityId) => keystoneValue(entityId, "Algebra I", "2024")),
      },
      {
        id: "graduation-rate",
        category: "Academics",
        label: "4-year cohort graduation rate",
        context: "Graduation data applies to high school cohorts; K-8 options are not directly comparable.",
        values: valuesFor((entityId) => graduationValue(entityId)),
      },
      {
        id: "essa-designation",
        category: "Accountability",
        label: "ESSA designation",
        context: "Future Ready fast facts provide accountability designations where reported.",
        values: valuesFor((entityId) =>
          entityId === "parkland-school-district" || entityId === "pa-state" || entityId === "parkland-virtual-academy"
            ? unavailable("Not directly comparable based on public data")
            : factValue(entityId, "ESSA designation"),
        ),
      },
      {
        id: "special-education",
        category: "Student support",
        label: "Special education",
        context: "Shown where Future Ready fast facts report a public value.",
        values: valuesFor((entityId) =>
          entityId === "parkland-school-district" || entityId === "pa-state" || entityId === "parkland-virtual-academy"
            ? unavailable()
            : factValue(entityId, "Special education"),
        ),
      },
      {
        id: "economically-disadvantaged",
        category: "Student support",
        label: "Economically disadvantaged",
        context: "Shown where Future Ready fast facts report a public value.",
        values: valuesFor((entityId) =>
          entityId === "parkland-school-district" || entityId === "pa-state" || entityId === "parkland-virtual-academy"
            ? unavailable()
            : factValue(entityId, "Economically disadvantaged"),
        ),
      },
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
