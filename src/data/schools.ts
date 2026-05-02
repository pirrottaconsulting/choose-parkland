export type SchoolOption = {
  id: string;
  name: string;
  category:
    | "district"
    | "district-virtual"
    | "charter"
    | "cyber-charter"
    | "private"
    | "alternative";
  gradeSpan: string;
  location: string;
  summary: string;
  sourceIds: string[];
};

export const schools: SchoolOption[] = [
  {
    id: "parkland-school-district",
    name: "Parkland School District",
    category: "district",
    gradeSpan: "K-12",
    location: "Lehigh County, Pennsylvania",
    summary:
      "A public district option for resident families, with state-published performance data and district accountability sources available for comparison.",
    sourceIds: ["future-ready-data-files", "pde-assessment-reporting"],
  },
  {
    id: "parkland-virtual-academy",
    name: "Parkland Virtual Academy",
    category: "district-virtual",
    gradeSpan: "K-12 program details to verify",
    location: "Parkland School District",
    summary:
      "A district-connected virtual learning option. Program details should be verified directly with Parkland before families decide.",
    sourceIds: ["parkland-virtual-academy"],
  },
  {
    id: "circle-of-seasons",
    name: "Circle of Seasons Charter School",
    category: "charter",
    gradeSpan: "Publicly posted program details to verify",
    location: "Lehigh County, Pennsylvania",
    summary:
      "A public charter option included for parent comparison. Performance and program details should be verified with official public sources.",
    sourceIds: ["circle-of-seasons-public-info", "future-ready-data-files"],
  },
  {
    id: "cyber-charter-options",
    name: "Cyber charter options",
    category: "cyber-charter",
    gradeSpan: "Varies by provider",
    location: "Pennsylvania",
    summary:
      "Online public charter options vary by provider, student needs, services, activities, and accountability data availability.",
    sourceIds: ["future-ready-data-files", "data-gov-pssa-keystone"],
  },
];
