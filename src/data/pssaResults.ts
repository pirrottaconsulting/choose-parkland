export type PssaResult = {
  entityId: string;
  entityName: string;
  schoolYear: string;
  subject: string;
  grade: string;
  proficientOrAdvanced: number | null;
  status: "placeholder" | "official";
  sourceIds: string[];
};

export const pssaResults: PssaResult[] = [
  {
    entityId: "parkland-school-district",
    entityName: "Parkland School District",
    schoolYear: "Latest available after ingestion",
    subject: "PSSA ELA / Math / Science",
    grade: "Grades 3-8 where applicable",
    proficientOrAdvanced: null,
    status: "placeholder",
    sourceIds: ["pde-assessment-reporting", "data-gov-pssa-keystone"],
  },
  {
    entityId: "circle-of-seasons",
    entityName: "Circle of Seasons Charter School",
    schoolYear: "Latest available after ingestion",
    subject: "PSSA ELA / Math / Science",
    grade: "Grades served where applicable",
    proficientOrAdvanced: null,
    status: "placeholder",
    sourceIds: ["pde-assessment-reporting", "data-gov-pssa-keystone"],
  },
];
