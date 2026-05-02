import Link from "next/link";
import { ComparisonExplorer } from "@/components/ComparisonExplorer";
import { DataDashboard } from "@/components/DataDashboard";
import { DataTable } from "@/components/DataTable";
import { Section } from "@/components/Section";
import { SourceList } from "@/components/SourceList";
import { comparisonContent, metricBy } from "@/lib/generated";

export default function Home() {
  const parklandEla = metricBy("parkland-school-district", "Percent proficient or advanced", "English Language Arts");
  const circleEla = metricBy("circle-of-seasons-charter-school", "Percent proficient or advanced", "English Language Arts");

  return (
    <>
      <section className="relative overflow-hidden bg-[#f7fbf8]">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#0f766e] via-[#2563eb] to-[#f59e0b]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#0f766e]">
              Official-data comparison for parents
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Before you choose another option, compare what Parkland already offers.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Choose Parkland brings PDE assessment files, Future Ready PA data, Parkland Virtual
              Academy program information, and comparison-school records into one parent-friendly
              decision tool.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/compare" className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white hover:bg-slate-800">
                Compare your options
              </Link>
              <Link href="/parkland-virtual-academy" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 hover:border-slate-400">
                Explore Parkland Virtual Academy
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f766e]">
              What the official data shows
            </p>
            <div className="mt-5 grid gap-4">
              {comparisonContent.summaries.map((summary) => (
                <div key={summary} className="rounded-lg bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-700">
                  {summary}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Data dashboard"
        title="Real imported metrics, visible on the page."
        description="These figures come from the current official files downloaded into the site data layer and committed with the static build."
      >
        <DataDashboard />
      </Section>

      <Section
        tone="soft"
        eyebrow="Parkland Virtual Academy"
        title="Flexibility without leaving the district connection."
        description="Parkland Virtual Academy is included because families comparing cyber charter options should also compare a district-connected virtual path, activities access, support, and accountability."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            "Compare online flexibility with access to local district resources.",
            "Ask how students remain connected to activities, counseling, services, and community.",
            "Review virtual-program information alongside official academic and accountability data.",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 font-semibold leading-7 text-slate-800 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Comparison selector"
        title="Filter the comparison by what matters to your family."
        description="Use the category controls to move between academics, flexibility, activities, support, accountability, and community connection."
      >
        <ComparisonExplorer />
      </Section>

      <Section
        tone="soft"
        eyebrow="What families usually compare"
        title="Numbers are the start. Fit is the decision."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Academics: Which official results apply to the school and grade span?",
            "Flexibility: Can a student learn online, hybrid, or in person?",
            "Activities: What athletics, arts, clubs, and local opportunities are available?",
            "Student support: How are counseling, special education, and services delivered?",
            "Accountability: Which public files report outcomes and designations?",
            "Community connection: Will the student stay connected to local peers and district life?",
          ].map((question) => (
            <div key={question} className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold leading-6 text-slate-800 shadow-sm">
              {question}
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Comparison table"
        title="Parkland, Circle of Seasons, cyber charter, and statewide rows."
        description={`${parklandEla?.entityName} reports ${parklandEla?.displayValue} in PSSA English Language Arts. ${circleEla?.entityName} reports ${circleEla?.displayValue} in the same imported file.`}
      >
        <DataTable />
      </Section>

      <Section
        tone="soft"
        eyebrow="Latest official data"
        title="Source files used by this build."
        description="Future Ready PA says its Index contains the most recent data available in the 2025-2026 school year; PDE publishes 2025 PSSA and Keystone school, district, and state Excel files."
      >
        <SourceList />
      </Section>

      <Section title="Parent decision checklist">
        <div className="grid gap-3">
          {[
            "Compare the official data, not just program names.",
            "Ask what services and activities are available before enrollment.",
            "Check whether results are district-level, school-level, or statewide.",
            "Compare cyber charter flexibility with Parkland Virtual Academy and district connection.",
            "Confirm transportation, counseling, special education, and extracurricular details with each school.",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
