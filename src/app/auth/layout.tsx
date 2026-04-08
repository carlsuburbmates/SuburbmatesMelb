import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SuburbMates',
    default: 'Protocol Access',
  },
  description: 'Secure creator portal for SuburbMates Melbourne directory access.',
  openGraph: {
    title: 'SuburbMates Auth Portal',
    description: 'Login or Register for the Melbourne Creator Directory.',
    type: 'website',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
