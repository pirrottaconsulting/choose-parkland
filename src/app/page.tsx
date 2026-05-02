import Link from "next/link";
import { ClaimBlock } from "@/components/ClaimBlock";
import { ComparisonCard } from "@/components/ComparisonCard";
import { DataCallouts } from "@/components/DataCallouts";
import { Section } from "@/components/Section";
import { SourceNote } from "@/components/SourceNote";
import { comparisonCriteria, lastUpdated } from "@/data";
import { getClaim } from "@/lib/site";

export default function Home() {
  const heroClaim = getClaim("compare-before-deciding");

  return (
    <>
      <section className="relative overflow-hidden bg-[#f7fbf8]">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#0f766e] via-[#2563eb] to-[#f59e0b]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#0f766e]">
              Parent education comparison
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Compare what Parkland already offers before choosing another path.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              A calm, factual guide for families evaluating district, charter, cyber charter,
              private, and alternative education options in and around Parkland School District.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/compare"
                className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white hover:bg-slate-800"
              >
                Compare your options
              </Link>
              <Link
                href="/parkland-virtual-academy"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 hover:border-slate-400"
              >
                Explore Parkland Virtual Academy
              </Link>
            </div>
            <SourceNote sourceIds={heroClaim.sourceIds} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="text-sm font-semibold text-teal-200">Decision dashboard</p>
              <p className="mt-3 text-3xl font-black tracking-tight">
                District resources. Virtual flexibility. Official data.
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              {["Academics", "Activities", "Support", "Community", "Accountability"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
                  >
                    <span className="font-semibold text-slate-800">{item}</span>
                    <span className="text-sm text-slate-500">Compare</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Latest official data"
        title="Data first, with clear placeholders where ingestion is still pending."
        description={`Latest official data language is used throughout. Automated source checks are scaffolded; current check status: ${lastUpdated.officialDataChecked}.`}
      >
        <DataCallouts />
      </Section>

      <Section
        tone="soft"
        eyebrow="What families compare"
        title="A practical framework for choosing a school option."
        description="The goal is not to label one option as good or bad. It is to help parents understand tradeoffs and verify facts before deciding."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {comparisonCriteria.slice(0, 4).map((criterion) => (
            <ComparisonCard key={criterion.id} criterion={criterion} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Flexibility without leaving the district"
        title="Parkland Virtual Academy belongs in the comparison."
        description="Families considering online learning should compare cyber charter options with any district-connected virtual pathway, including access to district resources, services, community, activities, and accountability."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <ClaimBlock claimId="pva-flexibility" />
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f766e]">
              Parent pathway
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Ask how virtual courses are staffed.",
                "Confirm access to activities and services.",
                "Compare official accountability data.",
                "Verify enrollment and eligibility details.",
              ].map((item) => (
                <div key={item} className="rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Questions parents should ask"
        title="Before choosing a charter, cyber charter, or alternative school."
        description="A parent-friendly sales engine should still be measured and factual. These questions help families evaluate fit without pressure."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Which official data files include this school?",
            "How current are the published performance results?",
            "What services are available if my child needs support?",
            "What activities and local community connections are available?",
            "How does virtual learning keep students accountable?",
            "What should be verified directly with the school before enrolling?",
          ].map((question) => (
            <div
              key={question}
              className="rounded-lg border border-slate-200 bg-white p-5 font-semibold text-slate-800 shadow-sm"
            >
              {question}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
