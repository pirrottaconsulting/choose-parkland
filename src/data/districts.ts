export type District = {
  id: string;
  name: string;
  county: string;
  state: string;
  type: "public-school-district";
  sourceIds: string[];
};

export const districts: District[] = [
  {
    id: "parkland-school-district",
    name: "Parkland School District",
    county: "Lehigh County",
    state: "Pennsylvania",
    type: "public-school-district",
    sourceIds: ["future-ready-data-files", "pde-assessment-reporting"],
  },
];
