import { Metadata } from 'next';
import { HelpClient } from './HelpClient';

export const metadata: Metadata = {
  title: 'Help Centre | SuburbMates Support',
  description: 'Access the SuburbMates help centre, FAQs, and support for Melbourne creators.',
};

export default function HelpPage() {
  return <HelpClient />;
}
