import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Parkland vs Cyber Charter",
  description:
    "Compare Parkland and Parkland Virtual Academy with cyber charter options before choosing online learning.",
};

export default function CyberCharterPage() {
  return (
    <LandingPage
      slug="parkland-vs-cyber-charter"
      eyebrow="Parkland vs cyber charter"
      title="Compare Parkland and PVA with cyber charter options."
      description="Online learning is a serious family decision. Compare graduation rate, Keystone grade 11 results, local support, PVA flexibility, activities, and transition back to in-person Parkland before deciding."
      entityIds={["parkland-school-district", "commonwealth-charter-academy-cs", "pa-cyber-cs", "agora-cyber-cs"]}
    />
  );
}
