import type { Metadata } from "next";
import { ClaimBlock } from "@/components/ClaimBlock";
import { DataCallouts } from "@/components/DataCallouts";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { SourceNote } from "@/components/SourceNote";

export const metadata: Metadata = {
  title: "Parkland Virtual Academy",
  description:
    "Explore Parkland Virtual Academy as a flexible, district-connected option to compare with cyber charter and alternative online schools.",
};

export default function VirtualAcademyPage() {
  return (
    <>
      <PageHero
        eyebrow="Parkland Virtual Academy"
        title="Flexibility without leaving the district conversation."
        description="For families considering online learning, the key comparison is not only location. It is access to teachers, support, activities, community, services, and accountable public data."
        primaryLabel="Compare with cyber charter"
        primaryHref="/parkland-vs-cyber-charter"
      />
      <Section
        eyebrow="What to verify"
        title="Questions for Parkland Virtual Academy and any cyber charter option."
        description="Current program details should be verified directly with Parkland and each alternative school before a family makes an enrollment decision."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Course staffing and delivery model",
            "Access to district services and counseling",
            "Eligibility for activities and local programs",
            "Progress monitoring and family communication",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 font-semibold text-slate-800 shadow-sm">
              {item}
            </div>
          ))}
        </div>
        <SourceNote sourceIds={["parkland-virtual-academy"]} />
      </Section>
      <Section tone="soft" title="Latest official data context">
        <DataCallouts />
      </Section>
      <Section title="Source-connected note">
        <ClaimBlock claimId="pva-flexibility" />
      </Section>
    </>
  );
}
