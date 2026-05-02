import { ComparisonMatrixHero } from "@/components/ComparisonMatrixHero";
import { DataDashboard } from "@/components/DataDashboard";
import { Section } from "@/components/Section";
import { SourceList } from "@/components/SourceList";

export default function Home() {
  return (
    <>
      <ComparisonMatrixHero />

      <Section
        eyebrow="Why these rows matter"
        title="The main decision is not one score. It is what a family gives up or keeps."
        description="The matrix starts with rows that are useful in a real parent decision: outcomes, virtual flexibility, K-12 continuity, high-school depth, activities, local support, and source transparency."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Parkland Virtual Academy is shown as a Parkland advantage: online flexibility while staying connected to the local district.",
            "Circle of Seasons is represented as a K-8 public charter, so high-school rows are labeled not applicable instead of forced.",
            "Cyber charter rows are shown with public data where available and neutral verification states where program details are not directly comparable.",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold leading-6 text-slate-800 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Parkland Virtual Academy"
        title="Online flexibility without leaving Parkland."
        description="PVA gives families a virtual path that remains connected to Parkland High School diploma expectations, local support, activities, and a path back to in-person instruction."
      >
        <div className="grid gap-5 lg:grid-cols-4">
          {[
            "Parkland High School diploma path",
            "Hybrid or fully online schedules",
            "On-site classroom and daily in-person help",
            "Transition back to in-person Parkland",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 font-black text-slate-900 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Source transparency"
        title="Every row points back to public data or an official page."
        description="The compact matrix is the main experience. The appendix below remains available for families who want to inspect the broader imported data."
      >
        <SourceList />
      </Section>

      <Section tone="soft" eyebrow="Detailed data appendix" title="Imported metrics behind the comparison.">
        <DataDashboard />
      </Section>
    </>
  );
}
