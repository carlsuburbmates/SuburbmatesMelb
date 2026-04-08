import { Metadata } from 'next';
import { ContactClient } from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Interface With Us | SuburbMates Melbourne',
  description: 'Connect with the SuburbMates team. Deploy your inquiries, system feedback, or partnership requests directly through our secure communication interface.',
};

export default function ContactPage() {
  return <ContactClient />;
}
