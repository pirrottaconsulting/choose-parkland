import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const generatedDir = join(root, "src", "data", "generated");
const requiredGenerated = [
  "source-manifest.json",
  "entities.json",
  "pssa-metrics.json",
  "keystone-metrics.json",
  "graduation-metrics.json",
  "future-ready-metrics.json",
  "all-metrics.json",
  "comparison-content.json",
  "comparison-matrix.json",
  "source-documents.json",
  "metrics.json",
  "comparison-rows.json",
  "comparison-pages.json",
];

const bannedPhrases = [
  "once the latest rows are ingested",
  "once rows are ingested",
  "pending verification",
  "placeholder data",
  "placeholder content",
  "future data",
  "future ingestion",
  "built for official rows",
];

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function assertNoBannedPhrases(path: string) {
  const text = readFileSync(path, "utf8").toLowerCase();
  for (const phrase of bannedPhrases) {
    assert.equal(text.includes(phrase), false, `${path} contains banned phrase: ${phrase}`);
  }
}

for (const file of requiredGenerated) {
  assert.equal(existsSync(join(generatedDir, file)), true, `Missing generated file: ${file}`);
}

const entities = readJson<{ entities: Array<{ id: string; name: string }> }>(join(generatedDir, "entities.json"));
assert.ok(entities.entities.some((entity) => entity.id === "parkland-school-district"), "Parkland entity is missing");
assert.ok(entities.entities.some((entity) => entity.id === "circle-of-seasons-charter-school"), "Circle of Seasons entity is missing");

const allMetrics = readJson<{ metrics: Array<{ id: string; sourceId?: string; sourceUrl?: string; displayValue?: string }> }>(
  join(generatedDir, "all-metrics.json"),
);
assert.ok(allMetrics.metrics.length >= 50, "Expected real generated metrics");
for (const metric of allMetrics.metrics) {
  assert.ok(metric.sourceId, `Metric missing sourceId: ${metric.id}`);
  assert.ok(metric.sourceUrl, `Metric missing sourceUrl: ${metric.id}`);
  assert.ok(metric.displayValue && metric.displayValue !== "null", `Metric missing display value: ${metric.id}`);
}

const comparisonMatrix = readJson<{
  entities: Array<{ id: string; locked?: boolean }>;
  rows: Array<{ id: string; values: Record<string, { sourceName?: string; sourceUrl?: string; displayValue?: string }> }>;
}>(join(generatedDir, "comparison-matrix.json"));
assert.ok(
  comparisonMatrix.entities.some((entity) => entity.id === "parkland-school-district" && entity.locked),
  "Parkland should be locked as the left-side comparison entity",
);
assert.ok(comparisonMatrix.rows.length >= 10, "Expected generated comparison matrix rows");
for (const row of comparisonMatrix.rows) {
  for (const [entityId, value] of Object.entries(row.values)) {
    assert.ok(value.sourceName, `Matrix row ${row.id}/${entityId} missing sourceName`);
    assert.ok(value.sourceUrl, `Matrix row ${row.id}/${entityId} missing sourceUrl`);
    assert.ok(value.displayValue, `Matrix row ${row.id}/${entityId} missing displayValue`);
  }
}

const comparisonRows = readJson<{
  entities: Array<{ id: string; recommended?: boolean; fixed?: boolean }>;
  pageDefaults: Record<string, string[]>;
  rows: Array<{
    id: string;
    sourceIds: string[];
    parklandCell: { sourceIds: string[] };
    comparatorRules: Array<{ entityId: string; cell: { sourceIds: string[] } }>;
  }>;
}>(join(generatedDir, "comparison-rows.json"));
assert.ok(
  comparisonRows.entities.some((entity) => entity.id === "parkland-school-district" && entity.recommended),
  "Parkland should be the highlighted recommended comparison entity",
);
assert.equal(
  comparisonRows.pageDefaults.home.includes("parkland-virtual-academy"),
  false,
  "PVA should not be treated as a homepage competitor",
);
for (const row of comparisonRows.rows) {
  assert.ok(row.sourceIds.length > 0, `Comparison row missing sourceIds: ${row.id}`);
  assert.ok(row.parklandCell.sourceIds.length > 0, `Parkland cell missing sourceIds: ${row.id}`);
  for (const rule of row.comparatorRules) {
    assert.ok(rule.cell.sourceIds.length > 0, `Comparator cell missing sourceIds: ${row.id}/${rule.entityId}`);
  }
}

const pageFiles = [
  "index.html",
  "compare.html",
  "parkland-vs-charter-schools.html",
  "circle-of-seasons-vs-parkland.html",
  "parkland-virtual-academy.html",
  "parkland-vs-cyber-charter.html",
  "alternatives-to-parkland-school-district.html",
  "best-education-options-in-parkland-school-district.html",
];

for (const file of pageFiles) {
  const path = join(root, "out", file);
  assert.equal(existsSync(path), true, `Missing static HTML page: ${file}`);
  const html = readFileSync(path, "utf8");
  assert.ok(html.includes("Source:"), `${file} does not include visible source citations`);
  assert.ok(html.includes("%") || html.includes("Enrollment"), `${file} does not include visible real content`);
  assert.equal(html.includes("Internal Server Error"), false, `${file} returned an internal error`);
  if (file === "index.html" || file === "compare.html" || file === "circle-of-seasons-vs-parkland.html" || file === "parkland-vs-cyber-charter.html") {
    assert.ok(html.includes("ComparisonMatrixHero"), `${file} does not include ComparisonMatrixHero`);
    assert.ok(html.includes("Parkland School District"), `${file} does not show Parkland as the anchor option`);
    assert.ok(html.includes("Recommended"), `${file} does not visually highlight the Parkland column`);
  }
  if (file === "index.html") {
    assert.ok(html.indexOf("ComparisonMatrixHero") < html.indexOf("Detailed data appendix"), "Homepage matrix should render before the data appendix");
    const defaultUnavailable = (html.slice(0, html.indexOf("Why these rows matter")).match(/Not available in the current official file|Not publicly available/g) ?? []).length;
    assert.ok(defaultUnavailable <= 2, "Homepage default matrix has too many not-available states");
    assert.equal(html.includes("Parkland Virtual Academy</h2>"), false, "PVA should not be a homepage default competitor column");
  }
  if (file === "circle-of-seasons-vs-parkland.html") assert.ok(html.includes("K-8"), "Circle page should include K-8 context");
  if (file === "parkland-vs-cyber-charter.html") assert.ok(html.includes("PVA"), "Cyber charter page should include PVA");
  if (file === "parkland-virtual-academy.html") {
    for (const phrase of ["Parkland High School diploma", "Hybrid or fully online", "On-site classroom", "Transition back"]) {
      assert.ok(html.includes(phrase), `PVA page missing ${phrase}`);
    }
  }
  assertNoBannedPhrases(path);
}

for (const path of [
  join(root, "README.md"),
  join(root, "src", "app", "page.tsx"),
  join(root, "src", "components", "LandingPage.tsx"),
]) {
  assertNoBannedPhrases(path);
}

console.log("Data and static site tests passed.");
