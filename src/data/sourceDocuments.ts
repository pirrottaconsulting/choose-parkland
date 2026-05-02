export type SourceDocument = {
  id: string;
  label: string;
  publisher: string;
  url: string;
  latestAvailable: string;
  kind: "official-data" | "official-program" | "program-information" | "placeholder";
  notes: string;
};

export const sourceDocuments: SourceDocument[] = [
  {
    id: "pde-assessment-reporting",
    label: "PDE Assessment Reporting",
    publisher: "Pennsylvania Department of Education",
    url: "https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting",
    latestAvailable: "Latest files published by PDE on its Assessment Reporting page",
    kind: "official-data",
    notes:
      "Official source target for PSSA and Keystone school-level Excel files. Future ingestion should parse the newest posted workbooks.",
  },
  {
    id: "future-ready-data-files",
    label: "Future Ready PA Index Data Files",
    publisher: "Pennsylvania Department of Education",
    url: "https://futurereadypa.org/Home/DataFiles",
    latestAvailable: "Latest Future Ready PA Index data files listed by PDE",
    kind: "official-data",
    notes:
      "Official source target for district and school indicator workbooks. Used here as a placeholder source until rows are ingested.",
  },
  {
    id: "data-gov-pssa-keystone",
    label: "Data.gov PSSA and Keystone Performance",
    publisher: "Data.gov / School District of Philadelphia",
    url: "https://catalog.data.gov/dataset/pssa-keystone-performance",
    latestAvailable: "Latest dataset metadata available from Data.gov",
    kind: "official-data",
    notes:
      "Public dataset catalog target requested for PSSA and Keystone performance data. Future ingestion should compare resource modified dates and determine whether statewide PDE files are more appropriate for Parkland comparisons.",
  },
  {
    id: "parkland-virtual-academy",
    label: "Parkland Virtual Academy program information",
    publisher: "Parkland School District",
    url: "https://www.parklandsd.org/",
    latestAvailable: "Program details should be verified with Parkland School District",
    kind: "official-program",
    notes:
      "Placeholder program source record. Replace URL with the canonical Parkland Virtual Academy page before launch.",
  },
  {
    id: "circle-of-seasons-public-info",
    label: "Circle of Seasons public program information",
    publisher: "Circle of Seasons Charter School",
    url: "https://circleofseasons.org/",
    latestAvailable: "Program details should be verified with Circle of Seasons Charter School",
    kind: "program-information",
    notes:
      "Placeholder source record for public program information. Do not use for performance claims until official data rows are ingested.",
  },
];

export const getSourceById = (id: string) => {
  const source = sourceDocuments.find((item) => item.id === id);

  if (!source) {
    throw new Error(`Missing source document: ${id}`);
  }

  return source;
};
