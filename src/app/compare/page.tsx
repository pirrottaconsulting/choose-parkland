import type { Metadata } from "next";
import { ComparisonMatrixHero } from "@/components/ComparisonMatrixHero";
import { DataDashboard } from "@/components/DataDashboard";
import { DataTable } from "@/components/DataTable";
import { Section } from "@/components/Section";
import { SourceList } from "@/components/SourceList";

export const metadata: Metadata = {
  title: "Compare Parkland with charter and cyber charter options",
  description:
    "Build a source-backed comparison of Parkland School District, Circle of Seasons, cyber charter schools, and statewide benchmarks.",
};

export default function ComparePage() {
  return (
    <>
      <ComparisonMatrixHero
        pageKey="compare"
        heading="Build your Parkland comparison."
        subheading="Select the options your family is considering and compare outcomes, flexibility, high-school depth, activities, support, and accountability from official public sources."
      />
      <Section eyebrow="Charts and appendix" title="More data below the matrix.">
        <DataDashboard />
        <div className="mt-8">
          <DataTable />
        </div>
      </Section>
      <Section tone="soft" title="Source documents">
        <SourceList />
      </Section>
    </>
  );
}
