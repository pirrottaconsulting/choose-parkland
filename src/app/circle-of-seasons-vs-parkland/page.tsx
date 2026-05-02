import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Circle of Seasons vs Parkland",
  description:
    "Compare Circle of Seasons Charter School and Parkland School District with a sourced, parent-friendly decision framework.",
};

export default function CircleOfSeasonsPage() {
  return (
    <LandingPage
      eyebrow="Circle of Seasons vs Parkland"
      title="Compare Circle of Seasons and Parkland with verified data, not assumptions."
      description="This page is structured for a fair comparison. Current content uses placeholder source records until official performance rows and verified program details are ingested."
      focusPoints={[
        "Check official PDE and Future Ready PA data for both schools when the latest rows are ingested.",
        "Verify Circle of Seasons program details directly with the school before making claims.",
        "Compare the learning model, activities, support services, and family communication expectations.",
        "Use this page as a parent decision tool, not as criticism of any school option.",
      ]}
      claimId="circle-placeholder"
      sourceIds={["circle-of-seasons-public-info", "future-ready-data-files", "pde-assessment-reporting"]}
    />
  );
}
