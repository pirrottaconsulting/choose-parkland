import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sourceDocuments } from "../src/data/sourceDocuments.ts";
import { lastUpdated } from "../src/data/lastUpdated.ts";

type CheckedSource = {
  id: string;
  label: string;
  url: string;
  status: number | "error";
  lastModified: string | null;
  etag: string | null;
  potentiallyNewer: boolean;
  message: string;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const reportPath = join(__dirname, "..", "reports", "official-data-check.json");
const baselineDate = lastUpdated.siteContent;

async function checkSource(source: (typeof sourceDocuments)[number]): Promise<CheckedSource> {
  if (source.kind !== "official-data") {
    return {
      id: source.id,
      label: source.label,
      url: source.url,
      status: "error",
      lastModified: null,
      etag: null,
      potentiallyNewer: false,
      message: "Skipped non-data source.",
    };
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 750));

    let response = await fetch(source.url, {
      method: "HEAD",
      headers: {
        "user-agent": "ChooseParklandDataMonitor/0.1 (+https://github.com/)",
      },
      redirect: "follow",
    });

    if (response.status === 404 || response.status === 405) {
      await new Promise((resolve) => setTimeout(resolve, 750));
      response = await fetch(source.url, {
        method: "GET",
        headers: {
          "user-agent": "ChooseParklandDataMonitor/0.1 (+https://github.com/)",
          range: "bytes=0-0",
        },
        redirect: "follow",
      });
    }

    const lastModified = response.headers.get("last-modified");
    const etag = response.headers.get("etag");
    const modifiedDate = lastModified ? new Date(lastModified) : null;
    const modifiedCalendarDate = modifiedDate ? modifiedDate.toISOString().slice(0, 10) : null;
    const potentiallyNewer = modifiedCalendarDate ? modifiedCalendarDate > baselineDate : false;

    return {
      id: source.id,
      label: source.label,
      url: source.url,
      status: response.status,
      lastModified,
      etag,
      potentiallyNewer,
      message: potentiallyNewer
        ? "Source headers suggest newer official data may be available."
        : "No newer source signal detected from response headers.",
    };
  } catch (error) {
    return {
      id: source.id,
      label: source.label,
      url: source.url,
      status: "error",
      lastModified: null,
      etag: null,
      potentiallyNewer: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function main() {
  const officialSources = sourceDocuments.filter((source) => source.kind === "official-data");
  const checkedAt = new Date().toISOString();
  const results = await Promise.all(officialSources.map(checkSource));
  const hasPotentialUpdate = results.some((item) => item.potentiallyNewer);
  const report = {
    checkedAt,
    baselineContentDate: lastUpdated.siteContent,
    hasPotentialUpdate,
    results,
    nextSteps:
      "Future ingestion will download official workbooks politely, parse rows, and update typed data files after human review.",
  };

  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Official source check complete: ${checkedAt}`);
  for (const result of results) {
    console.log(`${result.label}: ${result.status} - ${result.message}`);
  }

  if (process.env.GITHUB_OUTPUT) {
    await writeFile(
      process.env.GITHUB_OUTPUT,
      `has_potential_update=${hasPotentialUpdate ? "true" : "false"}\nreport_path=${reportPath}\n`,
      { flag: "a" },
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
