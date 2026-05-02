import { readFile } from "node:fs/promises";
import { join } from "node:path";

async function main() {
  const reportPath = join(process.cwd(), "reports", "official-data-check.json");

  let report = "";
  try {
    report = await readFile(reportPath, "utf8");
  } catch {
    console.log("No official data report found. Run npm run data:check first.");
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY is not set. Skipping AI summarization.");
    console.log("Report is available for manual review at reports/official-data-check.json.");
    return;
  }

  console.log("OPENAI_API_KEY detected. Deterministic summary remains the source of truth for changed links.");
  console.log("OpenAI summarization is disabled until an approved API client is added; no data is inferred.");
  console.log(`Report bytes available for future summarization: ${report.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
