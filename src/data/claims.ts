export type Claim = {
  id: string;
  text: string;
  sourceIds: string[];
  status: "source-backed" | "needs-verification" | "placeholder";
};

export const claims: Claim[] = [
  {
    id: "compare-before-deciding",
    text: "Before choosing a charter, cyber charter, or alternative school, compare what Parkland already offers.",
    sourceIds: ["pde-assessment-reporting", "future-ready-data-files", "parkland-virtual-academy"],
    status: "source-backed",
  },
  {
    id: "public-official-data",
    text: "This site uses publicly available data from official sources where available.",
    sourceIds: ["pde-assessment-reporting", "future-ready-data-files", "data-gov-pssa-keystone"],
    status: "source-backed",
  },
  {
    id: "pva-flexibility",
    text: "Parkland Virtual Academy is presented as a flexible, district-connected learning option; families should verify current program details with Parkland.",
    sourceIds: ["parkland-virtual-academy"],
    status: "needs-verification",
  },
  {
    id: "circle-placeholder",
    text: "Circle of Seasons comparison content currently uses placeholder source records until official performance rows and verified program details are ingested.",
    sourceIds: ["circle-of-seasons-public-info", "future-ready-data-files"],
    status: "placeholder",
  },
];
