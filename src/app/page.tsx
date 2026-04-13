import { BrowseSection } from "@/components/home/BrowseSection";
import { CTASection } from "@/components/home/CTASection";
import { CreatorSpotlight } from "@/components/home/CreatorSpotlight";
import { FAQSection } from "@/components/home/FAQSection";
import { StaticHero } from "@/components/home/StaticHero";
import { FreshSignals } from "@/components/home/FreshSignals";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyJoinSection } from "@/components/home/WhyJoinSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suburbmates | Melbourne's Digital Neighbourhood & Creator Directory",
  description: "Discover and explore premium digital assets from creators across Melbourne's 6 Metro Regions. Zero commission. Direct outbound routing to your favorite creators.",
};

export const revalidate = 3600; // 1 hour

export default function Home() {
  return (
    <>
      <StaticHero />
      <FreshSignals />
      <CreatorSpotlight />
      <CTASection />
      <BrowseSection />
      <HowItWorks />
      <WhyJoinSection />
      <FAQSection />
    </>
  );
}
