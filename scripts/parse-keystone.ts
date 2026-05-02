import { join } from "node:path";
import { clean, GENERATED_DIR, num, officialSources, pct, readWorkbookRows, sourceById, sourceLocalPath, writeJson } from "./data-utils.ts";
import type { MetricRecord } from "./data-utils.ts";

const ENTITY_BY_AUN: Record<string, { id: string; type: MetricRecord["entityType"]; name?: string }> = {
  "121395103": { id: "parkland-school-district", type: "district", name: "Parkland School District" },
  "121394017": { id: "circle-of-seasons-charter-school", type: "school", name: "Circle of Seasons CS" },
  "124150002": { id: "21st-century-cyber-cs", type: "cyber", name: "21st Century Cyber CS" },
  "126510020": { id: "agora-cyber-cs", type: "cyber", name: "Agora Cyber CS" },
  "115220002": { id: "commonwealth-charter-academy-cs", type: "cyber", name: "Commonwealth Charter Academy CS" },
  "127043430": { id: "pa-cyber-cs", type: "cyber", name: "PA Cyber" },
  "123460001": { id: "pa-virtual-cs", type: "cyber", name: "PA Virtual" },
};

function shouldKeep(row: Record<string, unknown>, type: "district" | "school" | "state") {
  if (clean(row.Group) !== "All Students") return false;
  if (type === "state") return true;
  return Boolean(ENTITY_BY_AUN[clean(row.AUN)]);
}

function parseFile(sourceId: string, type: "district" | "school" | "state") {
  const source = sourceById(sourceId);
  return readWorkbookRows(sourceLocalPath(source), 3)
    .filter((row) => shouldKeep(row, type))
    .map<MetricRecord>((row) => {
      const aun = clean(row.AUN);
      const entity = ENTITY_BY_AUN[aun];
      const fallbackName = clean(row["School Name"]) || clean(row["District Name"]);
      const entityName = type === "state" ? "Pennsylvania statewide" : entity?.name ?? fallbackName;
      const value = num(row["Percent Proficient and above"]);
      return {
        id: `${sourceId}-${type === "state" ? "pa-state" : entity?.id}-${clean(row.Subject)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        entityId: type === "state" ? "pa-state" : entity?.id ?? "unknown",
        entityName,
        entityType: type === "state" ? "state" : entity?.type ?? type,
        category: "Academics",
        metric: "Percent proficient or advanced",
        subject: clean(row.Subject),
        grade: clean(row.Grade),
        value,
        displayValue: pct(value),
        schoolYear: source.schoolYear,
        sourceId,
        sourceName: source.name,
        sourceUrl: source.url,
        note: "Keystone results shown are grade 11 results where reported by PDE.",
      };
    });
}

async function main() {
  const metrics = [
    ...parseFile("pde-2024-keystone-district-grade-11", "district"),
    ...parseFile("pde-2024-keystone-school-grade-11", "school"),
    ...parseFile("pde-2025-keystone-district", "district"),
    ...parseFile("pde-2025-keystone-school", "school"),
    ...parseFile("pde-2025-keystone-state", "state"),
  ];

  await writeJson(join(GENERATED_DIR, "keystone-metrics.json"), {
    generatedAt: new Date().toISOString(),
    sources: officialSources.filter((source) => source.category === "keystone").map((source) => source.id),
    metrics,
  });

  console.log(`Wrote ${metrics.length} Keystone metrics`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
