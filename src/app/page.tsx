import { BrowseSection } from "@/components/home/BrowseSection";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { StaticHero } from "@/components/home/StaticHero";
import { FreshSignals } from "@/components/home/FreshSignals";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyJoinSection } from "@/components/home/WhyJoinSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suburbmates | Curated Melbourne Prelaunch",
  description:
    "Melbourne beta rollout for founding creators. Apply to join the curated prelaunch as suburb-by-suburb profiles are reviewed and published.",
};

export const revalidate = 3600; // 1 hour

export default function Home() {
  return (
    <>
      <StaticHero />
      <FreshSignals />
      <CTASection />
      <FeaturedSection />
      <BrowseSection />
      <HowItWorks />
      <WhyJoinSection />
      <FAQSection />
    </>
  );
}
