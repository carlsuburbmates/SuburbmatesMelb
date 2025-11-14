import { HeroCarousel } from '@/components/home/HeroCarousel';
import { BrowseSection } from '@/components/home/BrowseSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyJoinSection } from '@/components/home/WhyJoinSection';
import { FAQSection } from '@/components/home/FAQSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <BrowseSection />
      <FeaturedSection />
      <HowItWorks />
      <WhyJoinSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
