import { Suspense } from 'react';
import { DirectoryHeader } from '@/components/directory/DirectoryHeader';
import { DirectoryFilters } from '@/components/directory/DirectoryFilters';
import { DirectoryListing } from '@/components/directory/DirectoryListing';
import { DirectorySearch } from '@/components/directory/DirectorySearch';
import { Container } from '@/components/layout/Container';

interface DirectoryPageProps {
  searchParams: Promise<{
    suburb?: string;
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-gray-50">
      <DirectoryHeader />
      
      <Container className="py-8">
        {/* Search Section */}
        <div className="mb-8">
          <DirectorySearch 
            initialSearch={params.search || ''} 
            initialSuburb={params.suburb || ''}
          />
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <DirectoryFilters 
            selectedCategory={params.category || ''}
            selectedSuburb={params.suburb || ''}
          />
        </div>

        {/* Results Section */}
        <Suspense fallback={<DirectoryListingSkeleton />}>
          <DirectoryListing 
            suburb={params.suburb}
            category={params.category}
            search={params.search}
            page={parseInt(params.page || '1')}
          />
        </Suspense>
      </Container>
    </main>
  );
}

function DirectoryListingSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const metadata = {
  title: 'Business Directory - SuburbMates',
  description: 'Discover local studios and creators in your Melbourne suburb. Connect with neighborhood services and digital marketplace vendors.',
};
