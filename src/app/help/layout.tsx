import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Protocol | SuburbMates',
  description: 'Find answers to common questions about the Melbourne Creator Directory or contact our support team.',
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
