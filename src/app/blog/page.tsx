import { Metadata } from 'next';
import { BlogClient } from './BlogClient';

export const metadata: Metadata = {
  title: 'Studio Logs | Strategic Intel for Melbourne Creators',
  description: 'Explore systematic insights, digital product trends, and community success stories from SuburbMates.',
  openGraph: {
    title: 'Studio Logs | SuburbMates Blog',
    description: 'Strategic intel for the Melbourne creative collective.',
    type: 'article',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
