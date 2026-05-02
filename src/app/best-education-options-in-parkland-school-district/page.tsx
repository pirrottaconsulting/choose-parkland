import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Best Education Options in Parkland School District",
  description:
    "Compare education options in Parkland School District with official data, Parkland Virtual Academy information, charter records, and cyber charter metrics.",
};

export default function BestOptionsPage() {
  return (
    <LandingPage
      slug="alternatives-to-parkland-school-district"
      eyebrow="Best education options in Parkland School District"
      title="The best option starts with a clear comparison."
      description="Families comparing education options in Parkland should review official data, student support, virtual flexibility, accountability, activities, and local district connection before choosing."
      entityIds={["parkland-school-district", "parkland-high-school", "circle-of-seasons-charter-school", "commonwealth-charter-academy-cs"]}
    />
  );
}
