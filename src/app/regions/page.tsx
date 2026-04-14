import { Suspense } from "react";
import { DirectoryHeader } from "@/components/regions/DirectoryHeader";
import { DirectoryFilters } from "@/components/regions/DirectoryFilters";
import { DirectoryListing } from "@/components/regions/DirectoryListing";
import { DirectorySearch } from "@/components/regions/DirectorySearch";

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
    <main
      data-testid="directory-page"
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Atmospheric glows */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[60%] h-[50%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 15% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-[20%] right-0 w-[40%] h-[40%]"
          style={{
            background: "radial-gradient(ellipse 50% 50% at 85% 30%, rgba(72, 52, 212, 0.04) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <DirectoryHeader />

        <div className="container-custom py-16 md:py-20">
          {/* Search */}
          <div className="mb-16">
            <DirectorySearch
              initialSearch={params.search || ""}
              initialRegion={params.region || ""}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <DirectoryFilters
                selectedCategory={params.category || ""}
                selectedRegion={params.region || ""}
              />
            </aside>

            {/* Results */}
            <div className="lg:w-3/4">
              <Suspense fallback={<DirectoryListingSkeleton />}>
                <DirectoryListing
                  region={params.region}
                  category={params.category}
                  search={params.search}
                  page={parseInt(params.page || "1")}
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
        <div
          key={i}
          className="p-8 rounded-2xl animate-pulse"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-8">
            <div
              className="w-16 h-16 rounded-xl animate-pulse shrink-0"
              style={{ background: "var(--bg-surface-3)" }}
            />
            <div className="flex-1 space-y-3">
              <div className="h-3 rounded-lg w-1/4" style={{ background: "var(--bg-surface-3)" }} />
              <div className="h-5 rounded-lg w-2/3" style={{ background: "var(--bg-surface-2)" }} />
              <div className="flex gap-4">
                <div className="h-2 rounded-lg w-16" style={{ background: "var(--bg-surface-2)" }} />
                <div className="h-2 rounded-lg w-24" style={{ background: "var(--bg-surface-2)" }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const metadata = {
  title: "Creator Directory - SuburbMates",
  description:
    "Discover local studios and digital creators in your Melbourne neighbourhood. Connect with professional services and discovery-first digital creators.",
};
