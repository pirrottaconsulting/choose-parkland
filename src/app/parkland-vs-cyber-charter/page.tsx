import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Parkland vs Cyber Charter",
  description:
    "Compare cyber charter options with Parkland Virtual Academy and Parkland School District resources before choosing online learning.",
};

export default function CyberCharterPage() {
  return (
    <LandingPage
      eyebrow="Parkland vs cyber charter"
      title="Need online flexibility? Compare cyber charter with a district-connected virtual option."
      description="Online learning is a serious family decision. Parkland Virtual Academy should be part of the comparison because it may offer flexibility while keeping families connected to district resources and accountability."
      focusPoints={[
        "Compare who teaches courses, how support is delivered, and how progress is monitored.",
        "Ask whether students can keep access to district activities, services, and local community connections.",
        "Check official public data sources for cyber charter performance where available.",
        "Verify current Parkland Virtual Academy details directly with the district before deciding.",
      ]}
      claimId="pva-flexibility"
      sourceIds={["parkland-virtual-academy", "future-ready-data-files", "data-gov-pssa-keystone"]}
    />
  );
}
