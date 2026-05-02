export type FutureReadyMetric = {
  entityId: string;
  entityName: string;
  metric: string;
  value: string;
  status: "placeholder" | "official";
  sourceIds: string[];
};

export const futureReadyMetrics: FutureReadyMetric[] = [
  {
    entityId: "parkland-school-district",
    entityName: "Parkland School District",
    metric: "Academic performance, student progress, and college/career readiness indicators",
    value: "Pending official workbook ingestion",
    status: "placeholder",
    sourceIds: ["future-ready-data-files"],
  },
  {
    entityId: "circle-of-seasons",
    entityName: "Circle of Seasons Charter School",
    metric: "Academic performance, student progress, and applicable school indicators",
    value: "Pending official workbook ingestion",
    status: "placeholder",
    sourceIds: ["future-ready-data-files"],
  },
];
