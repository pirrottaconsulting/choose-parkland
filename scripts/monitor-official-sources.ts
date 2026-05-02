import { sourceDocuments } from "../src/data/sourceDocuments.ts";

async function main() {
  console.log("Monitoring official education data sources.");
  console.log("This scaffold intentionally performs no aggressive scraping.");

  for (const source of sourceDocuments.filter((item) => item.kind === "official-data")) {
    console.log(`Queued source for future monitor: ${source.label} (${source.url})`);
  }

  console.log(
    "Future implementation: compare known file inventories, download only changed files, and hand parsed rows to the data validation layer.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
