import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { officialSources } from "./data-utils.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const reportPath = join(__dirname, "..", "reports", "official-data-check.json");
const previousReportPath = join(__dirname, "..", "src", "data", "generated", "source-manifest.json");

const sourcePages = [
  {
    id: "pde-assessment-reporting",
    name: "PDE Assessment Reporting",
    url: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
  },
  {
    id: "future-ready-data-files",
    name: "Future Ready PA Data Files",
    url: "https://futurereadypa.org/Home/DataFiles",
  },
];

function absoluteUrl(baseUrl: string, href: string) {
  return new URL(href.replace(/&amp;/g, "&"), baseUrl).toString();
}

function excelLinks(html: string, baseUrl: string) {
  const links = new Set<string>();
  for (const match of html.matchAll(/href=["']([^"']+(?:xlsx|xls|getdatafile\?id=\d+)[^"']*)["']/gi)) {
    links.add(absoluteUrl(baseUrl, match[1]));
  }
  return [...links].sort();
}

async function fetchPage(page: (typeof sourcePages)[number]) {
  const response = await fetch(page.url, {
    headers: { "user-agent": "ChooseParklandDataMonitor/1.0" },
  });
  if (!response.ok) throw new Error(`${page.name} returned ${response.status}`);
  const html = await response.text();
  return {
    ...page,
    status: response.status,
    lastModified: response.headers.get("last-modified"),
    links: excelLinks(html, page.url),
  };
}

async function main() {
  const checkedAt = new Date().toISOString();
  const knownUrls = new Set(officialSources.map((source) => source.url));
  const previousManifest = JSON.parse(await readFile(previousReportPath, "utf8").catch(() => '{"sources":[]}'));
  const previousUrls = new Set<string>((previousManifest.sources ?? []).map((source: { url: string }) => source.url));

  const pages = [];
  for (const page of sourcePages) {
    pages.push(await fetchPage(page));
    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  const discoveredLinks = pages.flatMap((page) => page.links);
  const recentOfficialLink = (url: string) => /2025|2024-2025|id=5[8-9]\b|id=60\b/i.test(url);
  const changedLinks = discoveredLinks.filter(
    (url) => recentOfficialLink(url) && !knownUrls.has(url) && !previousUrls.has(url),
  );
  const report = {
    checkedAt,
    changed: changedLinks.length > 0,
    changedLinks,
    deterministicSummary:
      changedLinks.length > 0
        ? `${changedLinks.length} Excel or data-file links are not in the current generated source manifest.`
        : "No changed official Excel/data-file links detected against the current generated source manifest.",
    pages,
  };

  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(report.deterministicSummary);
  for (const link of changedLinks.slice(0, 10)) console.log(`Changed link: ${link}`);

  if (process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY detected. Site impact summarization can run after npm run data:summarize.");
  } else {
    console.log("OPENAI_API_KEY is not set. Deterministic summary written to reports/official-data-check.json.");
  }

  if (process.env.GITHUB_OUTPUT) {
    await writeFile(
      process.env.GITHUB_OUTPUT,
      `has_potential_update=${changedLinks.length > 0 ? "true" : "false"}\nreport_path=${reportPath}\nsummary=${report.deterministicSummary}\n`,
      { flag: "a" },
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
