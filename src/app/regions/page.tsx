import { Suspense } from 'react';
import { DirectoryHeader } from '@/components/regions/DirectoryHeader';
import { DirectoryFilters } from '@/components/regions/DirectoryFilters';
import { DirectoryListing } from '@/components/regions/DirectoryListing';
import { DirectorySearch } from '@/components/regions/DirectorySearch';

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
    <main className="min-h-screen bg-ink-base relative overflow-hidden">
      {/* Radial ambient glows — layered depth matching homepage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(180, 120, 60, 0.08) 0%, transparent 65%)",
            "radial-gradient(ellipse 60% 45% at 85% 10%, rgba(80, 100, 140, 0.07) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 40% at 50% 60%, rgba(60, 100, 90, 0.05) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
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
      </div>
    </main>
  );
}

function DirectoryListingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-ink-surface-1 p-8 rounded-sm border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-sm animate-pulse shrink-0"></div>
            <div className="flex-1 space-y-4">
              <div className="h-3 bg-white/10 rounded-full w-1/4 animate-pulse"></div>
              <div className="h-6 bg-white/5 rounded-full w-2/3 animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-2 bg-white/5 rounded-full w-16 animate-pulse"></div>
                <div className="h-2 bg-white/5 rounded-full w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/5 animate-pulse shrink-0"></div>
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
