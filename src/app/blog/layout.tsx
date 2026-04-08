import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Logs | SuburbMates',
  description: 'Systematic insights, case studies, and strategic reports for Melbourne\'s creative collective.',
  openGraph: {
    title: 'Studio Logs - SuburbMates Blog',
    description: 'Insights for Melbourne creators.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
