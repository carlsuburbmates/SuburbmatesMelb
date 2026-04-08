import { redirect } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | SuburbMates',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  redirect("/vendor/dashboard");
}
