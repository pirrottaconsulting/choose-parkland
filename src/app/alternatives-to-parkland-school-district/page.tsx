import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Alternatives to Parkland School District",
  description:
    "Compare Parkland School District with charter, cyber charter, private, and alternative education options before deciding.",
};

export default function AlternativesPage() {
  return (
    <LandingPage
      eyebrow="Alternatives to Parkland School District"
      title="Considering another school option? Compare what Parkland already offers first."
      description="Families may have good reasons to explore alternatives. This page helps parents compare options calmly, using official public data where available and verified program information where needed."
      focusPoints={[
        "Compare academics through official PDE and Future Ready PA files when rows are available.",
        "Verify whether flexible learning can happen through Parkland Virtual Academy before leaving the district.",
        "Ask each option how services, activities, counseling, and accountability work in practice.",
        "Separate program fit from unsupported assumptions by checking source labels and update dates.",
      ]}
      sourceIds={["pde-assessment-reporting", "future-ready-data-files", "parkland-virtual-academy"]}
    />
  );
}
