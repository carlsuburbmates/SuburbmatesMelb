import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export default function BusinessNotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="py-24">
        <div className="text-center max-w-lg mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Business Not Found
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            We couldn&rsquo;t find the business you&rsquo;re looking for. It may have been removed,
            or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Directory
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Looking for something specific?</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Try searching in our <Link href="/directory" className="text-blue-600 hover:text-blue-800">creator directory</Link></p>
              <p>• Browse by <Link href="/directory?category=" className="text-blue-600 hover:text-blue-800">category</Link> or <Link href="/directory?suburb=" className="text-blue-600 hover:text-blue-800">suburb</Link></p>
              <p>• Check out our <Link href="/marketplace" className="text-blue-600 hover:text-blue-800">digital marketplace</Link></p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export const metadata = {
  title: 'Business Not Found - SuburbMates',
  description: 'The business you\'re looking for could not be found.',
};
