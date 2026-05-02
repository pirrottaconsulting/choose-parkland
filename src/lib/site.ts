import { sourceManifest } from "@/lib/generated";

export const siteConfig = {
  name: "Choose Parkland",
  url: "https://d14v1gk73nujde.cloudfront.net",
  description:
    "A parent-friendly comparison site for families evaluating Parkland School District, charter, cyber charter, and alternative education options.",
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
  citation: sourceManifest.map((source) => source.url),
};
