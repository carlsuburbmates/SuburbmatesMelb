import { BrowseSection } from "@/components/home/BrowseSection";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { StaticHero } from "@/components/home/StaticHero";
import { FreshSignals } from "@/components/home/FreshSignals";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyJoinSection } from "@/components/home/WhyJoinSection";

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
