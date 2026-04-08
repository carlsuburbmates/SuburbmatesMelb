import { Metadata } from 'next';
import { SignupClient } from '@/components/auth/SignupClient';

export const metadata: Metadata = {
  title: 'Identity Registration | SuburbMates',
  description: 'Join the SuburbMates Melbourne community. Register to discover local creators or initialize your vendor protocol to start showcasing and selling your digital assets.',
};

export default function SignupPage() {
  return <SignupClient />;
}
