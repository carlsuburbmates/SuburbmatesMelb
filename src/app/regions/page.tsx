import { Suspense } from 'react';
import { DirectoryHeader } from '@/components/regions/DirectoryHeader';
import { DirectoryFilters } from '@/components/regions/DirectoryFilters';
import { DirectoryListing } from '@/components/regions/DirectoryListing';
import { DirectorySearch } from '@/components/regions/DirectorySearch';
import { Container } from '@/components/layout/Container';

interface DirectoryPageProps {
  searchParams: Promise<{
    region?: string;
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <DirectoryHeader />
      
      <div className="container-custom py-20">
        {/* Discovery & Navigation Layer */}
        <div className="mb-20">
          <DirectorySearch 
            initialSearch={params.search || ''} 
            initialRegion={params.region || ''}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Refined Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <DirectoryFilters 
              selectedCategory={params.category || ''}
              selectedRegion={params.region || ''}
            />
          </aside>

          {/* High-Density Results Grid */}
          <div className="lg:w-3/4">
            <Suspense fallback={<DirectoryListingSkeleton />}>
              <DirectoryListing 
                region={params.region}
                category={params.category}
                search={params.search}
                page={parseInt(params.page || '1')}
              />
            </Suspense>
          </div>
        </div>
      </div>
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
  title: 'Creator Directory - SuburbMates',
  description: 'Discover local studios and digital creators in your Melbourne neighbourhood. Connect with professional services and discovery-first digital creators.',
};
