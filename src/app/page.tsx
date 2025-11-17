import { BrowseSection } from "@/components/home/BrowseSection";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyJoinSection } from "@/components/home/WhyJoinSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <CTASection />
      <FeaturedSection />
      <BrowseSection />
      <HowItWorks />
      <WhyJoinSection />
      <FAQSection />
    </>
  );
}
