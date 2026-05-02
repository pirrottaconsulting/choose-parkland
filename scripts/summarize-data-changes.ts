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

  console.log("OPENAI_API_KEY detected, but API integration is intentionally not wired yet.");
  console.log(
    "Future implementation: submit the official-source diff to an OpenAI model and write a human-review summary.",
  );
  console.log(`Report bytes available for future summarization: ${report.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
