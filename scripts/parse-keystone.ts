import { join } from "node:path";
import { clean, GENERATED_DIR, num, officialSources, pct, readWorkbookRows, sourceById, writeJson } from "./data-utils.ts";
import type { MetricRecord } from "./data-utils.ts";

const PARKLAND_AUN = "121395103";

function shouldKeep(row: Record<string, unknown>, type: "district" | "school" | "state") {
  if (clean(row.Group) !== "All Students") return false;
  if (type === "state") return true;
  return clean(row.AUN) === PARKLAND_AUN;
}

function parseFile(sourceId: string, type: "district" | "school" | "state") {
  const source = sourceById(sourceId);
  return readWorkbookRows(source.localPath, 3)
    .filter((row) => shouldKeep(row, type))
    .map<MetricRecord>((row) => {
      const entityName = type === "state" ? "Pennsylvania statewide" : clean(row["School Name"]) || clean(row["District Name"]);
      const value = num(row["Percent Proficient and above"]);
      return {
        id: `${sourceId}-${clean(row.Subject)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        entityId: type === "state" ? "pa-state" : type === "school" ? "parkland-high-school" : "parkland-school-district",
        entityName,
        entityType: type === "state" ? "state" : type,
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
