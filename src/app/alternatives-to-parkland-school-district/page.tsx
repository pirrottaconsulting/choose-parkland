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
      slug="alternatives-to-parkland-school-district"
      eyebrow="Alternatives to Parkland School District"
      title="Considering another school option? Compare what Parkland already offers first."
      description="Families may have good reasons to explore alternatives. This page compares official academic, support, accountability, and program data without treating any option as automatically right or wrong."
    />
  );
}
