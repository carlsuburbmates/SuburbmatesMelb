import { Metadata } from 'next';
import { HelpClient } from './HelpClient';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: 'Help Centre | SuburbMates Support',
  description: 'Access the SuburbMates help database, FAQs, and support protocols for Melbourne creators.',
  openGraph: {
    title: 'Help Centre | SuburbMates Support',
    description: 'Support protocols for Melbourne creators.',
    type: 'website',
  },
};

export default function HelpPage() {
  return (
    <div className="bg-ink-base min-h-screen">
      <Header />
      <main>
        <HelpClient />
      </main>
      <Footer />
    </div>
  );
}
