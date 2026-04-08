import { Metadata } from 'next';
import { VendorLayoutClient } from './VendorLayoutClient';

export const metadata: Metadata = {
  title: 'Creator Workspace | SuburbMates',
  description: 'Manage your creator profile and assets on SuburbMates.',
  robots: { index: false, follow: false },
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <VendorLayoutClient>{children}</VendorLayoutClient>;
}
