import { DataTable } from "@/components/DataTable";
import { ComparisonMatrixHero } from "@/components/ComparisonMatrixHero";
import { Section } from "@/components/Section";
import { TrendChart } from "@/components/TrendChart";
import { pageBySlug } from "@/lib/generated";

type LandingPageProps = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  entityIds?: string[];
};

export function LandingPage({ slug, title, description, entityIds }: LandingPageProps) {
  const content = pageBySlug(slug);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What should families compare before choosing a school option?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Families should compare official data, services, flexibility, accountability, activities, and district connection before deciding.",
        },
      },
      {
        "@type": "Question",
        name: "Is this comparison anti-charter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The site is a data-first parent decision tool that compares district, charter, cyber charter, and alternative options without shaming families.",
        },
      },
    ],
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: (entityIds ?? ["parkland-school-district", "circle-of-seasons-charter-school"]).map((id, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: id.replace(/-/g, " "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, itemListSchema]) }}
      />
      <ComparisonMatrixHero pageKey={slug} heading={title} subheading={description} />
      <Section
        eyebrow="What the official data shows"
        title={content?.sections[0]?.heading ?? "What the official data shows"}
        description={content?.sections[0]?.body}
      >
        <DataTable entityIds={entityIds} />
      </Section>
      <Section
        eyebrow="Trend view"
        title="How to read changes over time."
        description="Trend charts appear when multiple comparable years are imported. When only the current official year is present, the site says so directly."
      >
        <TrendChart entityId="parkland-school-district" subject="English Language Arts" />
      </Section>
      <Section tone="soft" title={content?.sections[1]?.heading ?? "What parents should ask"}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            content?.sections[1]?.body,
            "Compare the data, services, flexibility, accountability, activities, and district connection before deciding.",
            content?.sections[2]?.body,
          ]
            .filter(Boolean)
            .map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold leading-6 text-slate-800 shadow-sm">
                {item}
              </div>
            ))}
        </div>
      </Section>
    </>
  );
}
