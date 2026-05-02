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
      slug="parkland-vs-cyber-charter"
      eyebrow="Parkland vs cyber charter"
      title="Need online flexibility? Compare cyber charter with a district-connected virtual option."
      description="Online learning is a serious family decision. Compare cyber charter metrics, support indicators, accountability labels, and Parkland Virtual Academy's district connection before deciding."
      entityIds={["parkland-school-district", "parkland-virtual-academy", "commonwealth-charter-academy-cs", "agora-cyber-cs", "21st-century-cyber-cs"]}
    />
  );
}
