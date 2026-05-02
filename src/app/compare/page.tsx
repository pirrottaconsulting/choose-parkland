import type { Metadata } from "next";
import { ClaimBlock } from "@/components/ClaimBlock";
import { ComparisonCard } from "@/components/ComparisonCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DataCallouts } from "@/components/DataCallouts";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { comparisonCriteria } from "@/data";

export const metadata: Metadata = {
  title: "Compare Parkland with charter, cyber charter, and alternative schools",
  description:
    "A parent-friendly comparison framework for evaluating Parkland School District, Parkland Virtual Academy, charter schools, cyber charters, and alternative options.",
};

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare options"
        title="A clearer way to compare education choices near Parkland."
        description="Use official data where available, ask consistent questions, and understand the tradeoffs before choosing a charter, cyber charter, private, or alternative school."
        primaryLabel="See the data"
      />
      <Section
        eyebrow="Comparison modules"
        title="Start with the questions that change a family decision."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {comparisonCriteria.map((criterion) => (
            <ComparisonCard key={criterion.id} criterion={criterion} />
          ))}
        </div>
      </Section>
      <Section tone="soft" eyebrow="Latest official data" title="Data readiness">
        <DataCallouts />
      </Section>
      <Section title="Side-by-side comparison table">
        <ComparisonTable />
      </Section>
      <Section tone="soft" title="Disclaimers">
        <ClaimBlock claimId="public-official-data" />
      </Section>
    </>
  );
}
