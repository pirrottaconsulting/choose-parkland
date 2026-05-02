import { join } from "node:path";
import { GENERATED_DIR, readJson, writeJson } from "./data-utils.ts";

async function main() {
  const comparisonRows = await readJson<{ rows: Array<{ id: string; category: string; label: string; parentQuestion: string; sourceIds: string[] }> }>(
    join(GENERATED_DIR, "comparison-rows.json"),
  );

  const pageCopy = [
    {
      slug: "home",
      title: "Compare what Parkland already includes.",
      description:
        "Before choosing a charter, cyber charter, or alternative school, see how Parkland's academics, virtual flexibility, activities, support services, and local community compare.",
      defaultCategory: "Best overall",
      internalLinks: ["/compare", "/parkland-virtual-academy", "/circle-of-seasons-vs-parkland", "/parkland-vs-cyber-charter"],
    },
    {
      slug: "compare",
      title: "Build your Parkland comparison",
      description: "Select charter, cyber charter, and statewide options to compare against Parkland's sourced rows.",
      defaultCategory: "Best overall",
      internalLinks: ["/parkland-virtual-academy", "/circle-of-seasons-vs-parkland", "/parkland-vs-cyber-charter"],
    },
    {
      slug: "circle-of-seasons-vs-parkland",
      title: "Parkland vs Circle of Seasons",
      description: "Compare Parkland and Circle of Seasons with K-8 context, PSSA rows, K-12 continuity, PVA flexibility, and high-school depth.",
      defaultCategory: "Best overall",
      internalLinks: ["/compare", "/parkland-virtual-academy", "/parkland-vs-charter-schools"],
    },
    {
      slug: "parkland-vs-cyber-charter",
      title: "Parkland and PVA vs cyber charter",
      description: "Compare Parkland's district-connected virtual flexibility with cyber charter options using graduation, Keystone, support, and activity rows.",
      defaultCategory: "Best overall",
      internalLinks: ["/compare", "/parkland-virtual-academy", "/alternatives-to-parkland-school-district"],
    },
    {
      slug: "parkland-virtual-academy",
      title: "Online flexibility. Parkland connection.",
      description:
        "Compare Parkland Virtual Academy with cyber charter options, including Parkland diploma, hybrid or fully online schedules, on-site support, and transition back to in-person Parkland.",
      defaultCategory: "Flexibility",
      internalLinks: ["/compare", "/parkland-vs-cyber-charter", "/alternatives-to-parkland-school-district"],
    },
  ];

  await writeJson(join(GENERATED_DIR, "comparison-pages.json"), {
    generatedAt: new Date().toISOString(),
    pages: pageCopy.map((page) => ({
      ...page,
      faq: [
        {
          question: "How should families use this comparison?",
          answer:
            "Use it as a source-backed starting point, then confirm current program details directly with each school before making an enrollment decision.",
        },
        {
          question: "Is this an anti-charter comparison?",
          answer:
            "No. The rows compare public facts, numbers, services, flexibility, accountability, and local connection without saying charter schools are bad.",
        },
      ],
      supportingRows: comparisonRows.rows
        .filter((row) => row.sourceIds.length > 0)
        .slice(0, 12)
        .map((row) => ({ id: row.id, label: row.label, parentQuestion: row.parentQuestion })),
    })),
  });

  console.log(`Generated comparison copy for ${pageCopy.length} pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
