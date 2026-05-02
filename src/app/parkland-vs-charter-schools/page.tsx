import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Parkland vs Charter Schools",
  description:
    "Parent-friendly comparison of Parkland School District and charter school options using official public data and verified program questions.",
};

export default function CharterPage() {
  return (
    <LandingPage
      eyebrow="Parkland vs charter schools"
      title="Compare the options without assuming one model fits every child."
      description="Charter schools can be part of a family's search. Before deciding, compare official data availability, program structure, services, activities, and local connection."
      focusPoints={[
        "Ask which official performance datasets include the charter school and which years are available.",
        "Compare services, transportation, activities, and communication expectations directly.",
        "Understand whether a specific charter model fits your child's learning needs.",
        "Compare the charter's program information with Parkland's district-connected resources.",
      ]}
      sourceIds={["pde-assessment-reporting", "future-ready-data-files"]}
    />
  );
}
