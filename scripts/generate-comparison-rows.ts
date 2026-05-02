import { join } from "node:path";
import { GENERATED_DIR, officialSources, readJson, sourceWithFileStats, writeJson } from "./data-utils.ts";
import type { EntityRecord, MetricRecord } from "./data-utils.ts";

type CellStatus =
  | "included"
  | "strong"
  | "numeric"
  | "not_applicable"
  | "not_directly_comparable"
  | "verify"
  | "not_publicly_available";

type ComparisonCell = {
  status: CellStatus;
  value: string;
  detail: string;
  sourceIds: string[];
};

type ComparisonRow = {
  id: string;
  category:
    | "Outcomes"
    | "Academics"
    | "Flexibility"
    | "High school depth"
    | "Activities"
    | "Facilities"
    | "Student support"
    | "Community"
    | "Accountability";
  priority: number;
  label: string;
  parentQuestion: string;
  parklandCell: ComparisonCell;
  comparatorRules: { entityId: string; cell: ComparisonCell }[];
  sourceIds: string[];
};

const cyberIds = ["commonwealth-charter-academy-cs", "pa-cyber-cs", "agora-cyber-cs", "pa-virtual-cs", "21st-century-cyber-cs"];
const comparatorIds = ["circle-of-seasons-charter-school", ...cyberIds, "pa-state"];

function cell(status: CellStatus, value: string, detail: string, sourceIds: string[]): ComparisonCell {
  return { status, value, detail, sourceIds };
}

function numeric(metric: MetricRecord | undefined, unavailable = "Not publicly available"): ComparisonCell {
  if (!metric) return cell("not_publicly_available", unavailable, "The current parsed public files do not include a directly usable value for this option.", ["pde-2025-pssa-school"]);
  return cell("numeric", metric.displayValue, metric.note ?? "Latest official data available.", [metric.sourceId]);
}

function metric(metrics: MetricRecord[], entityId: string, subjectOrMetric: string, sourceIncludes?: string) {
  return metrics
    .filter((item) => item.entityId === entityId)
    .filter((item) => item.subject === subjectOrMetric || item.metric === subjectOrMetric)
    .filter((item) => !sourceIncludes || item.sourceId.includes(sourceIncludes))
    .sort((a, b) => b.schoolYear.localeCompare(a.schoolYear))[0];
}

function rule(entityId: string, cellValue: ComparisonCell) {
  return { entityId, cell: cellValue };
}

function rulesFor(cells: Record<string, ComparisonCell>) {
  return comparatorIds.map((entityId) => rule(entityId, cells[entityId] ?? cell("verify", "Verify directly", "Public source data is insufficient for a direct comparison.", ["pde-charter-schools"])));
}

function k8Cell() {
  return cell("not_applicable", "Not applicable - K-8", "Circle of Seasons states that it serves grades K-8.", ["circle-of-seasons-homepage"]);
}

function cyberCell(value: string, detail = "Separate cyber charter school model; compare the public program directly.") {
  return cell("not_directly_comparable", value, detail, ["pde-cyber-charter-schools"]);
}

async function main() {
  const allMetrics = await readJson<{ metrics: MetricRecord[] }>(join(GENERATED_DIR, "all-metrics.json"));
  const entities = await readJson<{ entities: EntityRecord[] }>(join(GENERATED_DIR, "entities.json"));
  const metrics = allMetrics.metrics;

  const entityList = [
    {
      id: "parkland-school-district",
      name: "Parkland School District",
      shortName: "Parkland",
      type: "district",
      badge: "Full-service local district",
      fixed: true,
      recommended: true,
      chips: ["In-person K-12", "Parkland Virtual Academy", "Local support", "Activities + athletics", "Official PDE data"],
    },
    {
      id: "circle-of-seasons-charter-school",
      name: "Circle of Seasons",
      shortName: "Circle",
      type: "charter",
      badge: "Local K-8 charter",
      chips: ["K-8", "Public charter", "Waldorf-inspired"],
    },
    {
      id: "commonwealth-charter-academy-cs",
      name: "Commonwealth Charter Academy",
      shortName: "CCA",
      type: "cyber",
      badge: "Cyber charter",
      chips: ["Online model", "K-12 where applicable"],
    },
    {
      id: "pa-cyber-cs",
      name: "PA Cyber",
      shortName: "PA Cyber",
      type: "cyber",
      badge: "Cyber charter",
      chips: ["Online model", "K-12 where applicable"],
    },
    {
      id: "agora-cyber-cs",
      name: "Agora Cyber",
      shortName: "Agora",
      type: "cyber",
      badge: "Cyber charter",
      chips: ["Online model", "K-12 where applicable"],
    },
    {
      id: "pa-virtual-cs",
      name: "PA Virtual",
      shortName: "PA Virtual",
      type: "cyber",
      badge: "Cyber charter",
      chips: ["Online model", "K-12 where applicable"],
    },
    {
      id: "21st-century-cyber-cs",
      name: "21st Century Cyber",
      shortName: "21st Century",
      type: "cyber",
      badge: "Cyber charter",
      chips: ["Online model", "Grades 6-12"],
    },
    {
      id: "pa-state",
      name: "Pennsylvania statewide",
      shortName: "PA statewide",
      type: "state",
      badge: "State benchmark",
      chips: ["Benchmark"],
    },
    {
      id: "parkland-virtual-academy",
      name: "Parkland Virtual Academy",
      shortName: "PVA",
      type: "program",
      badge: "Parkland online pathway",
      fixed: false,
      recommended: true,
      chips: ["Parkland diploma", "Hybrid/online", "On-site support", "Transition back"],
    },
  ];

  const rows: ComparisonRow[] = [
    {
      id: "four-year-graduation-rate",
      category: "Outcomes",
      priority: 1,
      label: "Four-year graduation rate",
      parentQuestion: "What share of students graduate in four years?",
      parklandCell: numeric(metric(metrics, "parkland-school-district", "4-year cohort graduation rate")),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": k8Cell(),
        "commonwealth-charter-academy-cs": numeric(metric(metrics, "commonwealth-charter-academy-cs", "4-year cohort graduation rate")),
        "pa-cyber-cs": numeric(metric(metrics, "pa-cyber-cs", "4-year cohort graduation rate")),
        "agora-cyber-cs": numeric(metric(metrics, "agora-cyber-cs", "4-year cohort graduation rate")),
        "pa-virtual-cs": numeric(metric(metrics, "pa-virtual-cs", "4-year cohort graduation rate")),
        "21st-century-cyber-cs": numeric(metric(metrics, "21st-century-cyber-cs", "4-year cohort graduation rate")),
        "pa-state": cell("not_directly_comparable", "Use as benchmark separately", "This row compares entity cohort rates where parsed.", ["pde-2024-2025-four-year-graduation-rates"]),
      }),
      sourceIds: ["pde-2024-2025-four-year-graduation-rates"],
    },
    ...["Literature", "Algebra I", "Biology"].map((subject, index) => ({
      id: `keystone-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      category: "Outcomes" as const,
      priority: 2 + index,
      label: `Keystone ${subject}, grade 11`,
      parentQuestion: `How do grade 11 ${subject} results compare?`,
      parklandCell: numeric(metric(metrics, "parkland-school-district", subject, "keystone")),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": k8Cell(),
        "commonwealth-charter-academy-cs": numeric(metric(metrics, "commonwealth-charter-academy-cs", subject, "keystone")),
        "pa-cyber-cs": numeric(metric(metrics, "pa-cyber-cs", subject, "keystone")),
        "agora-cyber-cs": numeric(metric(metrics, "agora-cyber-cs", subject, "keystone")),
        "pa-virtual-cs": numeric(metric(metrics, "pa-virtual-cs", subject, "keystone")),
        "21st-century-cyber-cs": numeric(metric(metrics, "21st-century-cyber-cs", subject, "keystone")),
        "pa-state": numeric(metric(metrics, "pa-state", subject, "keystone")),
      }),
      sourceIds: ["pde-2025-keystone-district", "pde-2025-keystone-school", "pde-2025-keystone-state"],
    })),
    ...[
      ["pssa-ela", "PSSA English Language Arts", "English Language Arts"],
      ["pssa-math", "PSSA Math", "Math"],
    ].map(([id, label, subject], index) => ({
      id,
      category: "Academics" as const,
      priority: 10 + index,
      label,
      parentQuestion: `What do the latest PSSA ${subject} results show?`,
      parklandCell: numeric(metric(metrics, "parkland-school-district", subject, "pssa")),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": numeric(metric(metrics, "circle-of-seasons-charter-school", subject, "pssa")),
        "commonwealth-charter-academy-cs": numeric(metric(metrics, "commonwealth-charter-academy-cs", subject, "pssa")),
        "pa-cyber-cs": numeric(metric(metrics, "pa-cyber-cs", subject, "pssa")),
        "agora-cyber-cs": numeric(metric(metrics, "agora-cyber-cs", subject, "pssa")),
        "pa-virtual-cs": numeric(metric(metrics, "pa-virtual-cs", subject, "pssa")),
        "21st-century-cyber-cs": numeric(metric(metrics, "21st-century-cyber-cs", subject, "pssa")),
        "pa-state": numeric(metric(metrics, "pa-state", subject, "pssa")),
      }),
      sourceIds: ["pde-2025-pssa-district", "pde-2025-pssa-school", "pde-2025-pssa-state"],
    })),
    {
      id: "k12-continuity",
      category: "Community",
      priority: 20,
      label: "K-12 continuity",
      parentQuestion: "Can a student stay in one local district pathway from elementary through high school?",
      parklandCell: cell("included", "K-12 district pathway", "Parkland serves elementary, middle, and high school students in one local district pathway.", ["future-ready-district-fast-facts-2024-2025"]),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": cell("not_applicable", "K-8 only", "Circle of Seasons states that it serves grades K-8.", ["circle-of-seasons-homepage"]),
        "commonwealth-charter-academy-cs": cyberCell("K-12 where applicable", "K-12 where applicable, but not a Parkland district pathway."),
        "pa-cyber-cs": cyberCell("K-12 where applicable", "K-12 where applicable, but not a Parkland district pathway."),
        "agora-cyber-cs": cyberCell("K-12 where applicable", "K-12 where applicable, but not a Parkland district pathway."),
        "pa-virtual-cs": cyberCell("K-12 where applicable", "K-12 where applicable, but not a Parkland district pathway."),
        "21st-century-cyber-cs": cyberCell("Grades 6-12", "Future Ready fast facts list grades 6-12 for this school."),
      }),
      sourceIds: ["future-ready-district-fast-facts-2024-2025", "circle-of-seasons-homepage", "future-ready-school-fast-facts-2024-2025"],
    },
    {
      id: "parkland-diploma-plus-virtual",
      category: "Flexibility",
      priority: 21,
      label: "Parkland diploma plus virtual option",
      parentQuestion: "Can a student learn online and still remain on a Parkland diploma path?",
      parklandCell: cell("strong", "Parkland diploma + PVA", "PVA page states students graduate with a Parkland High School diploma.", ["parkland-virtual-academy-page"]),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": k8Cell(),
        "commonwealth-charter-academy-cs": cyberCell("Separate school model", "Separate cyber charter diploma / not Parkland diploma."),
        "pa-cyber-cs": cyberCell("Separate school model", "Separate cyber charter diploma / not Parkland diploma."),
        "agora-cyber-cs": cyberCell("Separate school model", "Separate cyber charter diploma / not Parkland diploma."),
        "pa-virtual-cs": cyberCell("Separate school model", "Separate cyber charter diploma / not Parkland diploma."),
        "21st-century-cyber-cs": cyberCell("Separate school model", "Separate cyber charter diploma / not Parkland diploma."),
      }),
      sourceIds: ["parkland-virtual-academy-page", "pde-cyber-charter-schools"],
    },
    {
      id: "hybrid-online-flexibility",
      category: "Flexibility",
      priority: 22,
      label: "Hybrid or fully online flexibility",
      parentQuestion: "Is online flexibility available without leaving Parkland?",
      parklandCell: cell("strong", "Hybrid or fully online through PVA", "PVA page states students can mix in-person and online learning or choose a fully online schedule.", ["parkland-virtual-academy-page"]),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": cell("not_directly_comparable", "Brick-and-mortar K-8 charter", "Circle of Seasons is a brick-and-mortar K-8 charter based on its public website.", ["circle-of-seasons-homepage"]),
        "commonwealth-charter-academy-cs": cyberCell("Online model"),
        "pa-cyber-cs": cyberCell("Online model"),
        "agora-cyber-cs": cyberCell("Online model"),
        "pa-virtual-cs": cyberCell("Online model"),
        "21st-century-cyber-cs": cyberCell("Online model"),
      }),
      sourceIds: ["parkland-virtual-academy-page", "circle-of-seasons-homepage", "pde-cyber-charter-schools"],
    },
    {
      id: "transition-back",
      category: "Flexibility",
      priority: 23,
      label: "Transition back to in-person Parkland",
      parentQuestion: "If online learning stops fitting, can the student transition back locally?",
      parklandCell: cell("included", "Transition back supported", "PVA page states Parkland supports transition back to traditional in-person instruction.", ["parkland-virtual-academy-page"]),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": cyberCell("Not the same-district Parkland transition"),
        "commonwealth-charter-academy-cs": cyberCell("Not the same-district Parkland transition"),
        "pa-cyber-cs": cyberCell("Not the same-district Parkland transition"),
        "agora-cyber-cs": cyberCell("Not the same-district Parkland transition"),
        "pa-virtual-cs": cyberCell("Not the same-district Parkland transition"),
        "21st-century-cyber-cs": cyberCell("Not the same-district Parkland transition"),
      }),
      sourceIds: ["parkland-virtual-academy-page", "pde-cyber-charter-schools"],
    },
    {
      id: "local-virtual-support",
      category: "Student support",
      priority: 24,
      label: "Local in-person virtual support",
      parentQuestion: "Can an online learner get local in-person help from Parkland staff?",
      parklandCell: cell("strong", "On-site classroom + Parkland staff", "PVA page describes an on-site classroom and daily in-person assistance from Parkland staff.", ["parkland-virtual-academy-page"]),
      comparatorRules: rulesFor({
        "circle-of-seasons-charter-school": cell("not_directly_comparable", "Brick-and-mortar K-8", "Circle is a physical K-8 charter; compare its support model directly.", ["circle-of-seasons-homepage"]),
        "commonwealth-charter-academy-cs": cell("verify", "Verify local supports", "Statewide cyber model; verify local in-person supports directly.", ["pde-cyber-charter-schools"]),
        "pa-cyber-cs": cell("verify", "Verify local supports", "Statewide cyber model; verify local in-person supports directly.", ["pde-cyber-charter-schools"]),
        "agora-cyber-cs": cell("verify", "Verify local supports", "Statewide cyber model; verify local in-person supports directly.", ["pde-cyber-charter-schools"]),
        "pa-virtual-cs": cell("verify", "Verify local supports", "Statewide cyber model; verify local in-person supports directly.", ["pde-cyber-charter-schools"]),
        "21st-century-cyber-cs": cell("verify", "Verify local supports", "Statewide cyber model; verify local in-person supports directly.", ["pde-cyber-charter-schools"]),
      }),
      sourceIds: ["parkland-virtual-academy-page", "pde-cyber-charter-schools", "circle-of-seasons-homepage"],
    },
    {
      id: "seven-day-tutoring",
      category: "Student support",
      priority: 25,
      label: "Seven-day tutoring support through PVA",
      parentQuestion: "What academic help is described for virtual learners?",
      parklandCell: cell("included", "Seven-day on-demand tutoring", "PVA page states extensive on-demand tutoring is available seven days a week.", ["parkland-virtual-academy-page"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-virtual-academy-page"],
    },
    {
      id: "ap-course-offerings",
      category: "High school depth",
      priority: 30,
      label: "AP course offerings",
      parentQuestion: "How much high school course depth is documented publicly?",
      parklandCell: cell("numeric", "30 AP course offerings", "Parkland High School Profile lists 30 AP course offerings.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": k8Cell() }),
      sourceIds: ["parkland-high-school-profile"],
    },
    {
      id: "electives",
      category: "High school depth",
      priority: 31,
      label: "Electives",
      parentQuestion: "How broad is the documented high school course menu?",
      parklandCell: cell("numeric", "162 elective offerings", "Parkland High School Profile lists 162 elective offerings.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": k8Cell() }),
      sourceIds: ["parkland-high-school-profile"],
    },
    {
      id: "dual-credit",
      category: "High school depth",
      priority: 32,
      label: "Dual credit",
      parentQuestion: "Are college-credit opportunities documented?",
      parklandCell: cell("numeric", "49 dual-credit courses", "Parkland High School Profile lists 49 dual-credit courses.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": k8Cell() }),
      sourceIds: ["parkland-high-school-profile"],
    },
    {
      id: "world-languages",
      category: "High school depth",
      priority: 33,
      label: "World languages",
      parentQuestion: "How many world language courses are publicly documented?",
      parklandCell: cell("numeric", "7 world language courses", "Parkland High School Profile lists 7 world language courses.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": cell("verify", "Verify directly / K-8 scope", "Compare the current K-8 language offerings directly with Circle of Seasons.", ["circle-of-seasons-homepage"]) }),
      sourceIds: ["parkland-high-school-profile"],
    },
    {
      id: "pltw-pathways",
      category: "High school depth",
      priority: 34,
      label: "Project Lead The Way pathways",
      parentQuestion: "Are specialized STEM pathways documented?",
      parklandCell: cell("included", "Biomedical, Computer Science, Engineering", "Parkland High School Profile lists three Project Lead The Way career pathways.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": cell("not_applicable", "Not a high-school pathway", "Circle of Seasons serves grades K-8.", ["circle-of-seasons-homepage"]) }),
      sourceIds: ["parkland-high-school-profile"],
    },
    {
      id: "arts-offerings",
      category: "Activities",
      priority: 40,
      label: "Arts offerings",
      parentQuestion: "What arts depth is documented publicly?",
      parklandCell: cell("included", "19 visual arts + 19 music/theatre courses", "Parkland High School Profile lists 19 visual arts courses and 19 music/theatre courses.", ["parkland-high-school-profile", "parkland-arts"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": cell("verify", "Verify directly", "Use Circle of Seasons public materials to compare current arts offerings.", ["circle-of-seasons-homepage"]) }),
      sourceIds: ["parkland-high-school-profile", "parkland-arts", "circle-of-seasons-homepage"],
    },
    {
      id: "athletics",
      category: "Activities",
      priority: 41,
      label: "Athletics",
      parentQuestion: "What athletic access is documented?",
      parklandCell: cell("included", "23 sports in profile; district also publishes athletics info", "Parkland High School Profile lists 23 sports. Parkland's athletics page is retained as an additional source.", ["parkland-high-school-profile", "parkland-athletics"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": cell("verify", "Verify directly", "Public source data is insufficient for a direct count.", ["circle-of-seasons-homepage"]) }),
      sourceIds: ["parkland-high-school-profile", "parkland-athletics"],
    },
    {
      id: "clubs",
      category: "Activities",
      priority: 42,
      label: "Clubs",
      parentQuestion: "How much student activity choice is documented?",
      parklandCell: cell("numeric", "More than 80 clubs", "Parkland High School Profile says more than 80 clubs are offered.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": cell("verify", "Verify directly", "Public source data is insufficient for a direct count.", ["circle-of-seasons-homepage"]) }),
      sourceIds: ["parkland-high-school-profile"],
    },
    {
      id: "late-activity-transportation",
      category: "Activities",
      priority: 43,
      label: "Late activity transportation",
      parentQuestion: "Can students get home after activities?",
      parklandCell: cell("included", "Late activity bus support", "Parkland maintains a late activity bus page; families should review route details and exceptions there.", ["parkland-late-activity-bus"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-late-activity-bus"],
    },
    {
      id: "campus-facilities",
      category: "Facilities",
      priority: 50,
      label: "Campus facilities",
      parentQuestion: "What physical campus depth is documented?",
      parklandCell: cell("included", "128-acre high school campus", "Profile describes theatres, studios, pool, tennis courts, fields, track/event arena, turf field, and lighted fields.", ["parkland-high-school-profile"]),
      comparatorRules: rulesFor({ "circle-of-seasons-charter-school": cell("verify", "Use official campus details", "Circle of Seasons states it is located on a campus in Fogelsville; compare current facilities directly.", ["circle-of-seasons-homepage"]) }),
      sourceIds: ["parkland-high-school-profile", "circle-of-seasons-homepage"],
    },
    {
      id: "special-education",
      category: "Student support",
      priority: 60,
      label: "Special education services",
      parentQuestion: "How should families compare student services?",
      parklandCell: cell("included", "Continuum of services", "Parkland special education page describes a continuum of services and individualized programs.", ["parkland-special-education"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-special-education", "pde-charter-schools"],
    },
    {
      id: "gifted-education",
      category: "Student support",
      priority: 61,
      label: "Gifted education",
      parentQuestion: "Are gifted services documented?",
      parklandCell: cell("included", "K-12 gifted services", "Parkland gifted page describes services from elementary through high school.", ["parkland-gifted-education"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-gifted-education"],
    },
    {
      id: "esl-support",
      category: "Student support",
      priority: 62,
      label: "ESL support",
      parentQuestion: "Are English learner supports documented?",
      parklandCell: cell("included", "ESL program page", "Parkland publishes an ESL program page through the Office of Teaching and Learning.", ["parkland-esl-program"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-esl-program"],
    },
    {
      id: "speech-language-support",
      category: "Student support",
      priority: 63,
      label: "Speech/language support",
      parentQuestion: "Are speech and language supports documented?",
      parklandCell: cell("included", "Speech/language support listed in student services", "Parkland student services navigation includes Speech & Language Support.", ["parkland-student-services"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-student-services"],
    },
    {
      id: "pva-local-guidance",
      category: "Student support",
      priority: 64,
      label: "Local counseling, mental health, college and career guidance through PVA",
      parentQuestion: "Does the virtual model include local Parkland guidance?",
      parklandCell: cell("strong", "Local PVA team", "PVA page describes a local program director, counselor, and special education specialists.", ["parkland-virtual-academy-page"]),
      comparatorRules: rulesFor({}),
      sourceIds: ["parkland-virtual-academy-page"],
    },
  ];

  const pageDefaults = {
    home: ["parkland-school-district", "circle-of-seasons-charter-school", "commonwealth-charter-academy-cs", "pa-cyber-cs"],
    compare: ["parkland-school-district", "circle-of-seasons-charter-school", "commonwealth-charter-academy-cs", "pa-cyber-cs"],
    "circle-of-seasons-vs-parkland": ["parkland-school-district", "circle-of-seasons-charter-school"],
    "parkland-vs-cyber-charter": ["parkland-school-district", "commonwealth-charter-academy-cs", "pa-cyber-cs", "agora-cyber-cs"],
    "parkland-virtual-academy": ["parkland-virtual-academy", "commonwealth-charter-academy-cs", "pa-cyber-cs", "agora-cyber-cs"],
  };

  await writeJson(join(GENERATED_DIR, "metrics.json"), {
    generatedAt: new Date().toISOString(),
    metrics,
  });

  await writeJson(join(GENERATED_DIR, "source-documents.json"), {
    generatedAt: new Date().toISOString(),
    sources: officialSources.map(sourceWithFileStats),
  });

  await writeJson(join(GENERATED_DIR, "comparison-rows.json"), {
    generatedAt: new Date().toISOString(),
    entities: entityList,
    pageDefaults,
    rows: rows.sort((a, b) => a.priority - b.priority),
  });

  const missingSourceIds = rows.flatMap((row) => [
    ...row.sourceIds,
    ...row.parklandCell.sourceIds,
    ...row.comparatorRules.flatMap((ruleItem) => ruleItem.cell.sourceIds),
  ]).filter((sourceId) => !officialSources.some((item) => item.id === sourceId));

  if (missingSourceIds.length > 0) {
    throw new Error(`Missing source documents: ${[...new Set(missingSourceIds)].join(", ")}`);
  }

  console.log(`Generated ${rows.length} comparison rows for ${entities.entities.length} parsed entities.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
