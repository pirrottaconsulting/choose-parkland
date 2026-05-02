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
  if (file === "index.html" || file === "compare.html") {
    assert.ok(html.includes("Add comparison"), `${file} does not include the comparison builder`);
    assert.ok(html.includes("Parkland School District"), `${file} does not show Parkland as the anchor option`);
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
