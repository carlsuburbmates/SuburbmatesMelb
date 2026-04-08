import { Metadata } from 'next';
import { SentryExampleClient } from './SentryExampleClient';

export const metadata: Metadata = {
  title: 'Sentry Example Page',
  description: 'Test Sentry for your Next.js app!',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SentryExampleClient />;
}
