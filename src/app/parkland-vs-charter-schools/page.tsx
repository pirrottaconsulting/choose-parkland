import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Parkland vs Charter Schools",
  description:
    "Parent-friendly comparison of Parkland School District and charter school options using official public data and practical parent questions.",
};

export default function CharterPage() {
  return (
    <LandingPage
      slug="parkland-vs-charter-schools"
      eyebrow="Parkland vs charter schools"
      title="Compare Parkland and charter school options using public data."
      description="Charter schools can be part of a family's search. Before deciding, compare official results, grade spans, supports, accountability, and the day-to-day school experience."
      entityIds={["parkland-school-district", "circle-of-seasons-charter-school"]}
    />
  );
}
