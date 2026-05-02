import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Circle of Seasons vs Parkland",
  description:
    "Compare Circle of Seasons Charter School and Parkland School District with K-8 context, PSSA data, K-12 continuity, PVA flexibility, and high-school depth.",
};

export default function CircleOfSeasonsPage() {
  return (
    <LandingPage
      slug="circle-of-seasons-vs-parkland"
      eyebrow="Circle of Seasons vs Parkland"
      title="Compare Parkland and Circle of Seasons."
      description="Circle of Seasons serves K-8. Parkland provides a K-12 district pathway with Parkland Virtual Academy flexibility, high-school depth, activities, and comparable PSSA rows where public data supports the comparison."
      entityIds={["parkland-school-district", "circle-of-seasons-charter-school"]}
    />
  );
}
