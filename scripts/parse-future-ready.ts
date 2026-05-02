import { join } from "node:path";
import { clean, GENERATED_DIR, num, officialSources, pct, readWorkbookSheet, sourceById, writeJson } from "./data-utils.ts";
import type { EntityRecord, MetricRecord } from "./data-utils.ts";

const PARKLAND_AUN = "121395103";
const CIRCLE_AUN = "121394017";
const CYBER_AUNS = new Set(["115220002", "126510020", "127043430", "123460001", "124150002"]);

const knownEntityIds: Record<string, string> = {
  "21st Century Cyber CS": "21st-century-cyber-cs",
  "Agora Cyber CS": "agora-cyber-cs",
  "Commonwealth Charter Academy CS": "commonwealth-charter-academy-cs",
  "Pennsylvania Cyber CS": "pa-cyber-cs",
  "Pennsylvania Virtual CS": "pa-virtual-cs",
  "Circle of Seasons CS": "circle-of-seasons-charter-school",
  "Parkland HS": "parkland-high-school",
};

function entityFromDistrict(row: Record<string, unknown>): EntityRecord {
  return {
    id: "parkland-school-district",
    name: "Parkland School District",
    type: "district",
    category: "Public school district",
    aun: clean(row.AUN),
    enrollment: num(row.DistrictEnrollment) ?? undefined,
    grades: clean(row.GradesOffered),
    website: clean(row.Website),
    sourceIds: ["future-ready-district-fast-facts-2024-2025"],
    facts: [
      { label: "District enrollment", value: String(row.DistrictEnrollment), sourceId: "future-ready-district-fast-facts-2024-2025" },
      { label: "Number of schools", value: String(row.NumberofSchools), sourceId: "future-ready-district-fast-facts-2024-2025" },
      { label: "Grades offered", value: clean(row.GradesOffered), sourceId: "future-ready-district-fast-facts-2024-2025" },
      { label: "Charter school enrollment", value: String(row.CharterSchoolEnrollment), sourceId: "future-ready-district-fast-facts-2024-2025" },
    ],
  };
}

function entityFromSchool(row: Record<string, unknown>): EntityRecord {
  const type = clean(row.OrganizationTypeCode) === "cyber" ? "cyber" : clean(row.OrganizationTypeCode) === "charter" ? "school" : "school";
  const name = clean(row.Name);
  const id = knownEntityIds[name] ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return {
    id,
    name,
    type,
    category: type === "cyber" ? "Cyber charter school" : clean(row.OrganizationTypeCode) === "charter" ? "Charter school" : "District school",
    aun: clean(row.AUN),
    schoolNumber: clean(row.Schl),
    enrollment: num(row.Enrollment) ?? undefined,
    grades: clean(row.GradesOffered),
    website: clean(row.WebSite),
    sourceIds: ["future-ready-school-fast-facts-2024-2025"],
    facts: [
      { label: "Enrollment", value: String(row.Enrollment), sourceId: "future-ready-school-fast-facts-2024-2025" },
      { label: "Grades offered", value: clean(row.GradesOffered), sourceId: "future-ready-school-fast-facts-2024-2025" },
      { label: "Economically disadvantaged", value: pct(row.EconomicallyDisadvantaged), sourceId: "future-ready-school-fast-facts-2024-2025" },
      { label: "Special education", value: pct(row.SpecialEducation), sourceId: "future-ready-school-fast-facts-2024-2025" },
      { label: "ESSA designation", value: clean(row.ESSASchoolDesignation), sourceId: "future-ready-school-fast-facts-2024-2025" },
    ],
  };
}

function metricFromEntity(entity: EntityRecord, label: string, value: number | string | null, sourceId: string): MetricRecord {
  const source = sourceById(sourceId);
  return {
    id: `${entity.id}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    entityId: entity.id,
    entityName: entity.name,
    entityType: entity.type,
    category: label.includes("ESSA") ? "Accountability" : "Student support",
    metric: label,
    value,
    displayValue:
      value === null
        ? "Not available in the current official file"
        : typeof value === "number"
          ? pct(value)
          : String(value),
    schoolYear: source.schoolYear,
    sourceId,
    sourceName: source.name,
    sourceUrl: source.url,
  };
}

async function main() {
  const districtRows = readWorkbookSheet("data/raw/future-ready/district-fast-facts-2024-2025.xlsx", "District Fast Facts");
  const schoolRows = readWorkbookSheet("data/raw/future-ready/school-fast-facts-2024-2025.xlsx", "School Fast Facts");
  const performanceRows = readWorkbookSheet("data/raw/future-ready/performance-2024-2025.xlsx", "State Assessment Measures");

  const parklandDistrict = districtRows.find((row) => clean(row.AUN) === PARKLAND_AUN);
  if (!parklandDistrict) throw new Error("Could not find Parkland SD in district fast facts");

  const relevantSchools = schoolRows.filter((row) => {
    const isParkland = clean(row.AUN) === PARKLAND_AUN;
    const isCircle = clean(row.AUN) === CIRCLE_AUN;
    const isCyber = CYBER_AUNS.has(clean(row.AUN));
    return isParkland || isCircle || isCyber;
  });

  const cyberRows = relevantSchools.filter((row) => CYBER_AUNS.has(clean(row.AUN)));
  const entities = [
    entityFromDistrict(parklandDistrict),
    ...relevantSchools
      .filter((row) => clean(row.AUN) === PARKLAND_AUN || clean(row.AUN) === CIRCLE_AUN)
      .map(entityFromSchool),
    ...cyberRows.map(entityFromSchool),
  ];

  const metrics: MetricRecord[] = [];
  for (const entity of entities) {
    for (const fact of entity.facts) {
      if (["Economically disadvantaged", "Special education"].includes(fact.label)) {
        metrics.push(metricFromEntity(entity, fact.label, num(fact.value), fact.sourceId));
      }
      if (fact.label === "ESSA designation") {
        metrics.push(metricFromEntity(entity, fact.label, fact.value, fact.sourceId));
      }
    }
  }

  const performanceMetrics = performanceRows
    .filter((row) => clean(row.AUN) === PARKLAND_AUN || clean(row.AUN) === CIRCLE_AUN || cyberRows.some((cyber) => clean(cyber.AUN) === clean(row.AUN) && clean(cyber.Schl) === clean(row.Schl)))
    .flatMap((row) => {
      const entity = entities.find((item) => item.aun === clean(row.AUN) && (!item.schoolNumber || item.schoolNumber === clean(row.Schl)));
      if (!entity) return [];
      const source = sourceById("future-ready-performance-2024-2025");
      return [
        ["Future Ready math/algebra proficiency", "PercentProficientorAdvancedonMathematicsAlgebra1_AllStudent", "StatewideAveragePercentProficientorAdvancedonMathematicsAlgebra1_AllStudent"],
        ["Future Ready ELA/literature proficiency", "PercentProficientorAdvancedonELALiterature_AllStudent", "StatewideAveragePercentProficientorAdvancedonELALiterature_AllStudent"],
        ["Future Ready science/biology proficiency", "PercentProficientorAdvancedonScienceBiology_AllStudent", "StatewideAveragePercentProficientorAdvancedonScienceBiology_AllStudent"],
      ].map(([label, key, stateKey]) => {
        const value = num(row[key]);
        return {
          id: `${entity.id}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          entityId: entity.id,
          entityName: entity.name,
          entityType: entity.type,
          category: "Academics",
          metric: label,
          value,
          displayValue: pct(value),
          comparisonValue: num(row[stateKey]),
          comparisonLabel: "Statewide average in Future Ready file",
          schoolYear: source.schoolYear,
          sourceId: source.id,
          sourceName: source.name,
          sourceUrl: source.url,
        } satisfies MetricRecord;
      });
    });

  await writeJson(join(GENERATED_DIR, "entities.json"), {
    generatedAt: new Date().toISOString(),
    entities,
  });

  await writeJson(join(GENERATED_DIR, "future-ready-metrics.json"), {
    generatedAt: new Date().toISOString(),
    sources: officialSources.filter((source) => source.category === "future-ready").map((source) => source.id),
    metrics: [...metrics, ...performanceMetrics],
  });

  console.log(`Wrote ${entities.length} entities and ${metrics.length + performanceMetrics.length} Future Ready metrics`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
