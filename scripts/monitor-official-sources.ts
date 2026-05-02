import { officialSources } from "./data-utils.ts";

async function main() {
  console.log("Monitoring official education data sources.");
  console.log("The monitor checks source pages for changed Excel links and file names.");

  for (const source of officialSources.filter((item) => item.category !== "program")) {
    console.log(`Queued source for monitor: ${source.name} (${source.url})`);
  }

  console.log("Run npm run data:update to download, parse, generate, test, and build before publishing new data.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
