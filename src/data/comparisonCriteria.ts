export type ComparisonCriterion = {
  id: string;
  label: string;
  parentQuestion: string;
  parklandFrame: string;
  alternativeFrame: string;
  sourceIds: string[];
};

export const comparisonCriteria: ComparisonCriterion[] = [
  {
    id: "academic-performance",
    label: "Academic performance",
    parentQuestion:
      "What do the latest official state files show for schools my child may attend?",
    parklandFrame:
      "Compare Parkland using PDE assessment and Future Ready PA data once the latest rows are ingested.",
    alternativeFrame:
      "Ask each charter, cyber charter, or private option which public datasets apply and how recent their published results are.",
    sourceIds: ["pde-assessment-reporting", "future-ready-data-files", "data-gov-pssa-keystone"],
  },
  {
    id: "flexibility",
    label: "Learning flexibility",
    parentQuestion:
      "Can my child learn differently without losing access to district supports and activities?",
    parklandFrame:
      "Parkland Virtual Academy is positioned here as a district-connected virtual option, pending verification against the canonical district program page.",
    alternativeFrame:
      "Cyber and alternative programs may offer remote schedules; families should compare staffing, services, activities, and local connection.",
    sourceIds: ["parkland-virtual-academy"],
  },
  {
    id: "services-support",
    label: "Services and support",
    parentQuestion:
      "Which option is responsible for services, accommodations, counseling, and student support?",
    parklandFrame:
      "Use district accountability and program records to evaluate support availability before deciding.",
    alternativeFrame:
      "Verify special education, counseling, transportation, and activity access directly with each school.",
    sourceIds: ["future-ready-data-files"],
  },
  {
    id: "community-activities",
    label: "Community and activities",
    parentQuestion:
      "Will my child stay connected to local peers, activities, and the wider school community?",
    parklandFrame:
      "District-connected options may preserve local school community pathways; families should confirm eligibility details with Parkland.",
    alternativeFrame:
      "Ask non-district options which extracurriculars, athletics, clubs, and local peer opportunities are available.",
    sourceIds: ["parkland-virtual-academy"],
  },
  {
    id: "accountability",
    label: "Accountability and transparency",
    parentQuestion:
      "Who publishes the results, how often are they updated, and what can I compare?",
    parklandFrame:
      "Parkland data should be compared through official PDE and Future Ready PA files when available.",
    alternativeFrame:
      "Charter and cyber charter options should also be checked through official data where applicable, plus their own public program information.",
    sourceIds: ["pde-assessment-reporting", "future-ready-data-files", "data-gov-pssa-keystone"],
  },
];
