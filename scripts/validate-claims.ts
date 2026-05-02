import { join } from "node:path";
import { GENERATED_DIR, readJson } from "./data-utils.ts";

async function main() {
  const rows = await readJson<{
    rows: Array<{
      id: string;
      sourceIds: string[];
      parklandCell: { sourceIds: string[] };
      comparatorRules: Array<{ entityId: string; cell: { sourceIds: string[] } }>;
    }>;
  }>(join(GENERATED_DIR, "comparison-rows.json"));

  const failures: string[] = [];
  for (const row of rows.rows) {
    if (row.sourceIds.length === 0) failures.push(`${row.id} missing row sourceIds`);
    if (row.parklandCell.sourceIds.length === 0) failures.push(`${row.id} missing Parkland sourceIds`);
    for (const rule of row.comparatorRules) {
      if (rule.cell.sourceIds.length === 0) failures.push(`${row.id}/${rule.entityId} missing comparator sourceIds`);
    }
  }

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }

  console.log(`Validated source IDs for ${rows.rows.length} comparison rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
