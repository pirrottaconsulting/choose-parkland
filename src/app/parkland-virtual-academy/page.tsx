import type { Metadata } from "next";
import { ComparisonExplorer } from "@/components/ComparisonExplorer";
import { DataTable } from "@/components/DataTable";
import { MetricCard } from "@/components/MetricCard";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { allMetrics } from "@/lib/generated";

export const metadata: Metadata = {
  title: "Parkland Virtual Academy",
  description:
    "Explore Parkland Virtual Academy as a flexible, district-connected option to compare with cyber charter and alternative online schools.",
};

export default function VirtualAcademyPage() {
  const pvaMetrics = allMetrics.filter((metric) => metric.entityId === "parkland-virtual-academy");

  return (
    <>
      <PageHero
        eyebrow="Parkland Virtual Academy"
        title="Flexibility without leaving the district connection."
        description="Parkland Virtual Academy belongs in the cyber charter comparison because families should weigh online flexibility, district resources, activities, support, and accountability together."
        primaryLabel="Compare with cyber charter"
        primaryHref="/parkland-vs-cyber-charter"
      />
      <Section
        eyebrow="Program data"
        title="What Parkland publishes about the virtual option."
        description="Program facts are drawn from Parkland's public Virtual Academy page and displayed alongside official state data for Parkland and cyber charter schools."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {pvaMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </Section>
      <Section
        tone="soft"
        eyebrow="Cyber charter comparison"
        title="Compare flexibility with academics, support, and accountability."
      >
        <ComparisonExplorer limit={15} />
      </Section>
      <Section
        title="Visible data table"
        description="Cyber charter and Parkland rows come from Future Ready fast facts, performance data, PDE assessments, and Parkland's public program page."
      >
        <DataTable entityIds={["parkland-school-district", "parkland-virtual-academy", "commonwealth-charter-academy-cs", "agora-cyber-cs", "21st-century-cyber-cs"]} />
      </Section>
    </>
  );
}
