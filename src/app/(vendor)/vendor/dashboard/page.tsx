import { Metadata } from 'next';
import { VendorDashboardClient } from './VendorDashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard | Creator Workspace',
  description: 'Manage your live assets and view repository snapshots.',
};

export default function VendorDashboardPage() {
  return <VendorDashboardClient />;
}
