import type { Metadata } from "next";
import { DataDashboard } from "@/components/DataDashboard";
import { DataTable } from "@/components/DataTable";
import { PageHero } from "@/components/PageHero";
import { ParklandComparisonBuilder } from "@/components/ParklandComparisonBuilder";
import { Section } from "@/components/Section";
import { SourceList } from "@/components/SourceList";

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
        title="Compare education choices near Parkland with imported official data."
        description="Filter metrics by category, review visible data tables, and use citations to check the official source behind each number."
        primaryLabel="See the data"
      />
      <Section eyebrow="Dashboard" title="Latest official data available in this build.">
        <DataDashboard />
      </Section>
      <Section tone="soft" eyebrow="Comparison builder" title="Keep Parkland fixed and add options to the right.">
        <ParklandComparisonBuilder />
      </Section>
      <Section title="Visible comparison table">
        <DataTable />
      </Section>
      <Section tone="soft" title="Citations">
        <SourceList />
      </Section>
    </>
  );
}
