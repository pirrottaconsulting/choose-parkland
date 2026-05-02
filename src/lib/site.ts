import { claims, getSourceById, sourceDocuments } from "@/data";

export const siteConfig = {
  name: "Choose Parkland",
  url: "https://choose-parkland.example.com",
  description:
    "A parent-friendly comparison site for families evaluating Parkland School District, charter, cyber charter, and alternative education options.",
};

export const sourceLabels = (sourceIds: string[]) =>
  sourceIds.map((id) => getSourceById(id).label).join(", ");

export const getClaim = (id: string) => {
  const claim = claims.find((item) => item.id === id);

  if (!claim) {
    throw new Error(`Missing claim: ${id}`);
  }

  return claim;
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  about: "Education option comparison for families in and around Parkland School District",
  citation: sourceDocuments.map((source) => source.url),
};
