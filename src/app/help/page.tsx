import { Metadata } from 'next';
import { HelpClient } from './HelpClient';

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
    <main className="bg-ink-base min-h-screen">
      <HelpClient />
    </main>
  );
}
