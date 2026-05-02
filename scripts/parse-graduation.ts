import { join } from "node:path";
import { clean, GENERATED_DIR, num, pct, readWorkbookSheet, sourceById, sourceLocalPath, writeJson } from "./data-utils.ts";
import type { MetricRecord } from "./data-utils.ts";

const SOURCE_ID = "pde-2024-2025-four-year-graduation-rates";

const entitiesByAun: Record<string, { id: string; name: string; type: MetricRecord["entityType"] }> = {
  "121395103": { id: "parkland-school-district", name: "Parkland School District", type: "district" },
  "124150002": { id: "21st-century-cyber-cs", name: "21st Century Cyber CS", type: "cyber" },
  "126510020": { id: "agora-cyber-cs", name: "Agora Cyber CS", type: "cyber" },
  "115220002": { id: "commonwealth-charter-academy-cs", name: "Commonwealth Charter Academy CS", type: "cyber" },
};

function rateToPercent(value: unknown) {
  const parsed = num(value);
  if (parsed === null) return null;
  return parsed <= 1 ? Number((parsed * 100).toFixed(1)) : parsed;
}

function metric(row: Record<string, unknown>): MetricRecord | null {
  const entity = entitiesByAun[clean(row.AUN)];
  if (!entity) return null;

  const source = sourceById(SOURCE_ID);
  const value = rateToPercent(row["Cohort Grad Rate"]);
  const cohort = num(row.Cohort);
  const grads = num(row.Grads);

  return {
    id: `${SOURCE_ID}-${entity.id}-cohort-graduation-rate`,
    entityId: entity.id,
    entityName: entity.name,
    entityType: entity.type,
    category: "Academics",
    metric: "4-year cohort graduation rate",
    value,
    displayValue: pct(value),
    schoolYear: source.schoolYear,
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl: source.url,
    note:
      grads !== null && cohort !== null
        ? `${grads.toLocaleString()} graduates in a cohort of ${cohort.toLocaleString()}.`
        : "Graduation cohort detail is not available in the current official file.",
  };
}

async function main() {
  const source = sourceById(SOURCE_ID);
  const rows = readWorkbookSheet(sourceLocalPath(source), "Grad Rate by LEA", 3);
  const metrics = rows.flatMap((row) => {
    const item = metric(row);
    return item ? [item] : [];
  });

  await writeJson(join(GENERATED_DIR, "graduation-metrics.json"), {
    generatedAt: new Date().toISOString(),
    sources: [SOURCE_ID],
    metrics,
  });

  console.log(`Wrote ${metrics.length} graduation metrics`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
