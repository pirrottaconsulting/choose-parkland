import { join } from "node:path";
import { officialSources, sourceWithFileStats, writeJson, GENERATED_DIR } from "./data-utils.ts";

async function main() {
  const programSources = officialSources.filter((source) => source.category === "program");
  await writeJson(join(GENERATED_DIR, "source-documents.json"), {
    generatedAt: new Date().toISOString(),
    sources: officialSources.map(sourceWithFileStats),
    officialProgramPages: programSources.map((source) => ({
      id: source.id,
      name: source.name,
      url: source.url,
      schoolYear: source.schoolYear,
    })),
  });
  console.log(`Indexed ${programSources.length} official program/source pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
