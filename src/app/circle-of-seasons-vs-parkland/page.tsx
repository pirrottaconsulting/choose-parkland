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
      slug="circle-of-seasons-vs-parkland"
      eyebrow="Circle of Seasons vs Parkland"
      title="Compare Circle of Seasons and Parkland with official data, not assumptions."
      description="Circle of Seasons and Parkland both appear in public data files. This page shows what is directly comparable and where a district-to-single-school comparison needs context."
      entityIds={["parkland-school-district", "circle-of-seasons-charter-school"]}
    />
  );
}
