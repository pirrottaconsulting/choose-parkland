import type { Metadata } from "next";
import { ComparisonMatrixHero } from "@/components/ComparisonMatrixHero";
import { DataTable } from "@/components/DataTable";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Parkland Virtual Academy vs cyber charter options",
  description:
    "Compare Parkland Virtual Academy with cyber charter options: Parkland diploma, hybrid or fully online schedules, on-site support, tutoring, activities, and transition back to in-person Parkland.",
};

export default function VirtualAcademyPage() {
  return (
    <>
      <ComparisonMatrixHero
        pageKey="parkland-virtual-academy"
        fixedEntityId="parkland-virtual-academy"
        defaultCategory="Flexibility"
        heading="Online flexibility. Parkland connection."
        subheading="Parkland Virtual Academy gives families online flexibility while keeping the Parkland diploma path, local support, activities, and a transition path back to in-person Parkland."
      />
      <Section
        eyebrow="PVA facts"
        title="What Parkland publishes about the virtual academy."
        description="These facts come from the Parkland Virtual Academy public page and are shown in the comparison as Parkland advantages, not as a separate competitor to Parkland School District."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Parkland High School diploma",
            "Hybrid or fully online schedule",
            "On-site classroom",
            "Daily in-person assistance from Parkland staff",
            "Seven-day on-demand tutoring",
            "Transition back to traditional in-person instruction",
          ].map((fact) => (
            <div key={fact} className="rounded-lg border border-slate-200 bg-white p-5 font-black text-slate-900 shadow-sm">
              {fact}
            </div>
          ))}
        </div>
      </Section>
      <Section tone="soft" title="Data appendix">
        <DataTable entityIds={["parkland-school-district", "parkland-virtual-academy", "commonwealth-charter-academy-cs", "pa-cyber-cs", "agora-cyber-cs"]} />
      </Section>
    </>
  );
}
