import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join } from "node:path";
import xlsx from "xlsx";

export const ROOT = process.cwd();
export const RAW_DIR = join(ROOT, "data", "raw");
export const GENERATED_DIR = join(ROOT, "src", "data", "generated");
export const RETRIEVED_AT = new Date().toISOString();

export type SourceRecord = {
  id: string;
  name: string;
  url: string;
  localPath: string;
  category: "pssa" | "keystone" | "future-ready" | "program";
  level?: "school" | "district" | "state" | "performance" | "school-fast-facts" | "district-fast-facts";
  schoolYear: string;
  retrievedAt: string;
  fileDate?: string;
  bytes?: number;
  localFallbackPath?: string;
};

export type MetricRecord = {
  id: string;
  entityId: string;
  entityName: string;
  entityType: "district" | "school" | "cyber" | "state" | "program";
  category: "Academics" | "Flexibility" | "Activities" | "Student support" | "Accountability" | "Community connection";
  metric: string;
  subject?: string;
  grade?: string;
  value: number | string | null;
  displayValue: string;
  comparisonValue?: number | string | null;
  comparisonLabel?: string;
  schoolYear: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  note?: string;
};

export type EntityRecord = {
  id: string;
  name: string;
  type: "district" | "school" | "cyber" | "state" | "program";
  category: string;
  aun?: string;
  schoolNumber?: string;
  county?: string;
  enrollment?: number;
  grades?: string;
  website?: string;
  sourceIds: string[];
  facts: { label: string; value: string; sourceId: string }[];
};

export const officialSources: SourceRecord[] = [
  {
    id: "pde-2025-pssa-district",
    name: "2025 PSSA District Level Data",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/education/documents/data-and-reporting/pssa-and-ayp-results/2025-pssa-district-level-data.xlsx",
    localPath: "data/raw/pde/2025-pssa-district-level-data.xlsx",
    category: "pssa",
    level: "district",
    schoolYear: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2025-pssa-school",
    name: "2025 PSSA School Level Data",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/education/documents/data-and-reporting/pssa-and-ayp-results/2025-pssa-school-level-data.xlsx",
    localPath: "data/raw/pde/2025-pssa-school-level-data.xlsx",
    category: "pssa",
    level: "school",
    schoolYear: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2025-pssa-state",
    name: "2025 PSSA State Level Data",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/education/documents/data-and-reporting/pssa-and-ayp-results/2025-pssa-state-level-data.xlsx",
    localPath: "data/raw/pde/2025-pssa-state-level-data.xlsx",
    category: "pssa",
    level: "state",
    schoolYear: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2025-keystone-district",
    name: "2025 Keystone District Level Data",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/education/documents/data-and-reporting/keystones/2025-keystone-exams-district-level-data.xlsx",
    localPath: "data/raw/pde/2025-keystone-district-level-data.xlsx",
    category: "keystone",
    level: "district",
    schoolYear: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2025-keystone-state",
    name: "2025 Keystone State Level Data",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/education/documents/data-and-reporting/keystones/2025-keystone-exams-state-level-data.xlsx",
    localPath: "data/raw/pde/2025-keystone-state-level-data.xlsx",
    category: "keystone",
    level: "state",
    schoolYear: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2025-keystone-school",
    name: "2025 Keystone School Level Data",
    url: "https://www.pa.gov/content/dam/copapwp-pagov/en/education/documents/data-and-reporting/keystones/2025-keystone-exams-school-level-data.xlsx",
    localPath: "data/raw/pde/2025-keystone-school-level-data.xlsx",
    category: "keystone",
    level: "school",
    schoolYear: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2024-keystone-district-grade-11",
    name: "2024 Keystone Exams District Grade 11 Data",
    url: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
    localPath: "data/raw/pde/2024-keystone-exams-district-grade-11-data.xlsx",
    localFallbackPath: "/Users/chrispirrotta/Desktop/2024-keystone-exams-district-grade-11-data.xlsx",
    category: "keystone",
    level: "district",
    schoolYear: "2024",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2024-keystone-school-grade-11",
    name: "2024 Keystone Exams School Grade 11 Data",
    url: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
    localPath: "data/raw/pde/2024-keystone-exams-school-grade-11-data.xlsx",
    localFallbackPath: "/Users/chrispirrotta/Desktop/2024-keystone-exams-school-grade-11-data.xlsx",
    category: "keystone",
    level: "school",
    schoolYear: "2024",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "pde-2024-2025-four-year-graduation-rates",
    name: "2024-2025 Pennsylvania 4-Year Cohort Graduation Rates",
    url: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
    localPath: "data/raw/pde/2024-2025-pennsylvania-4-year-cohort-graduation-rates.xlsx",
    localFallbackPath: "/Users/chrispirrotta/Desktop/2024-2025 pennsylvania 4-year cohort graduation rates.xlsx",
    category: "keystone",
    level: "district",
    schoolYear: "2024-2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "future-ready-performance-2024-2025",
    name: "Future Ready Performance Data for SY 2024-2025",
    url: "https://futurereadypa.org/home/getdatafile?id=60",
    localPath: "data/raw/future-ready/performance-2024-2025.xlsx",
    category: "future-ready",
    level: "performance",
    schoolYear: "2024-2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "future-ready-school-fast-facts-2024-2025",
    name: "School Fast Facts for SY 2024-2025",
    url: "https://futurereadypa.org/home/getdatafile?id=58",
    localPath: "data/raw/future-ready/school-fast-facts-2024-2025.xlsx",
    category: "future-ready",
    level: "school-fast-facts",
    schoolYear: "2024-2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "future-ready-district-fast-facts-2024-2025",
    name: "District Fast Facts for SY 2024-2025",
    url: "https://futurereadypa.org/home/getdatafile?id=59",
    localPath: "data/raw/future-ready/district-fast-facts-2024-2025.xlsx",
    category: "future-ready",
    level: "district-fast-facts",
    schoolYear: "2024-2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "parkland-virtual-academy-page",
    name: "Parkland Virtual Academy public program page",
    url: "https://www.parklandsd.org/schools/parkland-virtual-academy",
    localPath: "data/raw/program/parkland-virtual-academy.html",
    category: "program",
    schoolYear: "2025-2026",
    retrievedAt: RETRIEVED_AT,
  },
];

export async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

export async function writeJson(path: string, data: unknown) {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

export function sourceWithFileStats(source: SourceRecord): SourceRecord {
  const fullPath = sourceLocalPath(source);
  const stats = existsSync(fullPath) ? statSync(fullPath) : undefined;
  const publicSource: SourceRecord = { ...source };
  delete publicSource.localFallbackPath;
  return {
    ...publicSource,
    fileDate: stats?.mtime.toISOString(),
    bytes: stats?.size,
  };
}

export function sourceLocalPath(source: SourceRecord) {
  const primary = isAbsolute(source.localPath) ? source.localPath : join(ROOT, source.localPath);
  if (existsSync(primary)) return primary;
  if (source.localFallbackPath && existsSync(source.localFallbackPath)) return source.localFallbackPath;
  return primary;
}

export function readWorkbookRows(path: string, range = 0): Record<string, unknown>[] {
  const workbook = xlsx.readFile(isAbsolute(path) ? path : join(ROOT, path), { cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { range, defval: "" });
}

export function readWorkbookSheet(path: string, sheetName: string, range = 0): Record<string, unknown>[] {
  const workbook = xlsx.readFile(isAbsolute(path) ? path : join(ROOT, path), { cellDates: false });
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { range, defval: "" });
}

export function clean(value: unknown) {
  return String(value ?? "").trim();
}

export function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function pct(value: unknown): string {
  const parsed = num(value);
  return parsed === null ? "Not available in the current official file" : `${parsed.toFixed(1).replace(/\\.0$/, "")}%`;
}

export function sourceById(id: string) {
  const source = officialSources.find((item) => item.id === id);
  if (!source) throw new Error(`Missing source ${id}`);
  return source;
}

export function downloadedFilename(source: SourceRecord) {
  return basename(source.localPath);
}
