import { existsSync } from "node:fs";
import { copyFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { ensureDir, officialSources, ROOT, sourceWithFileStats, writeJson } from "./data-utils.ts";

async function download(source: (typeof officialSources)[number]) {
  const outputPath = join(ROOT, source.localPath);

  if (source.localFallbackPath) {
    if (!existsSync(source.localFallbackPath)) {
      throw new Error(`Local official workbook is missing for ${source.name}: ${source.localFallbackPath}`);
    }
    await ensureDir(dirname(outputPath));
    await copyFile(source.localFallbackPath, outputPath);
    console.log(`Copied local official workbook for ${source.name} -> ${source.localPath}`);
    return;
  }

  await ensureDir(dirname(outputPath));

  const response = await fetch(source.url, {
    headers: {
      "user-agent": "ChooseParklandDataPipeline/1.0",
      accept: source.localPath.endsWith(".html") ? "text/html" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${source.name}: ${response.status} ${response.statusText}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
  console.log(`Downloaded ${source.name} -> ${source.localPath} (${bytes.length} bytes)`);
}

async function main() {
  for (const source of officialSources) {
    await download(source);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await writeJson(
    join(ROOT, "src", "data", "generated", "source-manifest.json"),
    {
      generatedAt: new Date().toISOString(),
      sources: officialSources.map(sourceWithFileStats),
    },
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
