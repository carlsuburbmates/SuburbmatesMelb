import { Metadata } from 'next';
import { SignupClient } from '@/components/auth/SignupClient';

export const metadata: Metadata = {
  title: 'Identity Registration | SuburbMates',
  description: 'Join the SuburbMates Melbourne community. Register to discover local creators, or claim and create your creator listing to start showcasing your digital products.',
};

export default function SignupPage() {
  return <SignupClient />;
}
