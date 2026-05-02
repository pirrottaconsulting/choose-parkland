import { join } from "node:path";
import { clean, GENERATED_DIR, num, officialSources, pct, readWorkbookRows, sourceById, writeJson } from "./data-utils.ts";
import type { MetricRecord } from "./data-utils.ts";

const PARKLAND_AUN = "121395103";
const CIRCLE_AUN = "121394017";
const ENTITY_BY_AUN: Record<string, { id: string; type: MetricRecord["entityType"]; name?: string }> = {
  "121395103": { id: "parkland-school-district", type: "district", name: "Parkland School District" },
  "121394017": { id: "circle-of-seasons-charter-school", type: "school", name: "Circle of Seasons CS" },
  "115220002": { id: "commonwealth-charter-academy-cs", type: "cyber", name: "Commonwealth Charter Academy CS" },
  "126510020": { id: "agora-cyber-cs", type: "cyber", name: "Agora Cyber CS" },
  "127043430": { id: "pa-cyber-cs", type: "cyber", name: "PA Cyber" },
  "123460001": { id: "pa-virtual-cs", type: "cyber", name: "PA Virtual" },
  "124150002": { id: "21st-century-cyber-cs", type: "cyber", name: "21st Century Cyber CS" },
};

function entityIdFromRow(row: Record<string, unknown>, level: "district" | "school" | "state") {
  if (level === "state") return "pa-state";
  const aun = clean(row.AUN);
  const school = clean(row["School Number"]).replace(/^0+/, "");
  if (ENTITY_BY_AUN[aun]) return ENTITY_BY_AUN[aun].id;
  if (aun === PARKLAND_AUN && level === "district") return "parkland-school-district";
  if (aun === PARKLAND_AUN && school === "2829") return "parkland-high-school";
  if (aun === CIRCLE_AUN) return "circle-of-seasons-charter-school";
  return `${aun}-${school || "district"}`;
}

function entityType(level: "district" | "school" | "state", row: Record<string, unknown>) {
  if (level === "state") return "state" as const;
  const known = ENTITY_BY_AUN[clean(row.AUN)];
  if (known) return known.type;
  if (clean(row["District Name"]).toLowerCase().includes("cyber")) return "cyber" as const;
  return level;
}

function shouldKeep(row: Record<string, unknown>, level: "district" | "school" | "state") {
  if (clean(row.Group) !== "All Students") return false;
  if (level !== "state" && clean(row.Grade) !== "Total") return false;
  if (level === "state") return ["English Language Arts", "Mathematics", "Science"].includes(clean(row.Subject));
  const district = clean(row["District Name"]);
  const school = clean(row["School Name"]);
  return (
    clean(row.AUN) === PARKLAND_AUN ||
    clean(row.AUN) === CIRCLE_AUN ||
    Boolean(ENTITY_BY_AUN[clean(row.AUN)]) ||
    district.toLowerCase().includes("cyber") ||
    school.toLowerCase().includes("cyber")
  );
}

function parseFile(sourceId: string, level: "district" | "school" | "state") {
  const source = sourceById(sourceId);
  const rows = readWorkbookRows(source.localPath, 3);
  const metrics: MetricRecord[] = [];

  for (const row of rows.filter((item) => shouldKeep(item, level))) {
    const subject = clean(row.Subject);
    const fallbackName = clean(row["School Name"]) || clean(row["District Name"]);
    const entityName =
      level === "state"
        ? "Pennsylvania statewide"
        : ENTITY_BY_AUN[clean(row.AUN)]?.name ?? fallbackName;
    const value = num(row["Percent Proficient and above"]);

    metrics.push({
      id: `${sourceId}-${entityIdFromRow(row, level)}-${subject}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      entityId: entityIdFromRow(row, level),
      entityName,
      entityType: entityType(level, row),
      category: "Academics",
      metric: "Percent proficient or advanced",
      subject,
      grade: clean(row.Grade) || "Total",
      value,
      displayValue: pct(value),
      schoolYear: source.schoolYear,
      sourceId,
      sourceName: source.name,
      sourceUrl: source.url,
      note: "PSSA results include grades 3-8 where applicable and exclude groups not reported by PDE disclosure rules.",
    });
  }

  return metrics;
}

async function main() {
  const metrics = [
    ...parseFile("pde-2025-pssa-district", "district"),
    ...parseFile("pde-2025-pssa-school", "school"),
    ...parseFile("pde-2025-pssa-state", "state"),
  ];

  await writeJson(join(GENERATED_DIR, "pssa-metrics.json"), {
    generatedAt: new Date().toISOString(),
    sources: officialSources.filter((source) => source.category === "pssa").map((source) => source.id),
    metrics,
  });

  console.log(`Wrote ${metrics.length} PSSA metrics`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
