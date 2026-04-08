import { Metadata } from 'next';
import { LoginClient } from '@/components/auth/LoginClient';

export const metadata: Metadata = {
  title: 'Sign In | SuburbMates',
  description: 'Log in to your SuburbMates account to manage your creator profile, track analytics, and update your digital assets.',
};

export default function LoginPage() {
  return <LoginClient />;
}
