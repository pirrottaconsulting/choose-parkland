import { ClaimBlock } from "@/components/ClaimBlock";
import { ComparisonTable } from "@/components/ComparisonTable";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { SourceNote } from "@/components/SourceNote";

type LandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  focusPoints: string[];
  claimId?: string;
  sourceIds: string[];
};

export function LandingPage({
  eyebrow,
  title,
  description,
  focusPoints,
  claimId = "public-official-data",
  sourceIds,
}: LandingPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Section
        eyebrow="Decision pathway"
        title="What to compare before enrolling."
        description="Use these prompts to understand fit, flexibility, services, published data, and accountability."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {focusPoints.map((point) => (
            <div key={point} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold leading-7 text-slate-800">{point}</p>
            </div>
          ))}
        </div>
        <SourceNote sourceIds={sourceIds} />
      </Section>
      <Section
        tone="soft"
        eyebrow="Comparison framework"
        title="Parkland vs other options."
        description="The table is built for official rows and verified program facts as they are ingested."
      >
        <ComparisonTable />
      </Section>
      <Section title="Source and update note">
        <ClaimBlock claimId={claimId} />
      </Section>
    </>
  );
}
