"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MapPin, Star, ExternalLink, Clock } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useScrollAnimation";

interface Business {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  tier: string | null;
  suburb: {
    id: number | null;
    name: string | null;
  };
  category: {
    id: number | null;
    name: string | null;
  };
  isFeatured: boolean;
  createdAt: string | null;
}

interface SearchResponse {
  results: Business[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface DirectoryListingProps {
  suburb?: string;
  category?: string;
  search?: string;
  page: number;
}

export function DirectoryListing({ suburb, category, search, page }: DirectoryListingProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;
  const cardsAnimation = useStaggeredAnimation(businesses.length, 100);
  const searchSessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `search-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: search ?? null,
            suburb: suburb ?? null,
            category: category ?? null,
            page,
            limit: itemsPerPage,
            session_id: searchSessionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch directory listings");
        }

        const json: { data: SearchResponse } = await response.json();
        if (!isMounted) return;
        setBusinesses(json.data.results ?? []);
        setTotalCount(json.data.pagination?.total ?? 0);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setError("Unable to load directory listings right now. Please try again later.");
        setBusinesses([]);
        setTotalCount(0);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBusinesses();
    return () => {
      isMounted = false;
    };
  }, [suburb, category, search, page, searchSessionId]);

  if (loading) {
    return <DirectoryListingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No businesses found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search criteria or explore different suburbs and categories.
        </p>
        <Link href="/directory" className="btn-primary">
          Browse All Businesses
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {businesses.length} of {totalCount} businesses
          {suburb && <span> near {suburb}</span>}
          {category && <span> â€¢ Category: {category}</span>}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Updated just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map((business, index) => (
          <div
            key={business.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative"
            style={{
              animation: `fadeIn 0.4s ease ${(cardsAnimation[index]?.delay || 0) / 1000}s both`,
            }}
          >
            {business.isFeatured && (
              <span className="absolute top-4 right-4 inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <Star className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}

            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {business.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {business.description || "Local business"}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {business.suburb?.name && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{business.suburb.name}</span>
                    </span>
                  )}
                  {business.category?.name && (
                    <span>{business.category.name}</span>
                  )}
                  {business.tier && (
                    <span className="uppercase text-xs tracking-wide text-gray-500">
                      {business.tier}
                    </span>
                  )}
                  <Link
                    href={`/business/${business.slug}`}
                    className="inline-flex items-center space-x-1 text-gray-900 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="space-x-3">
            {page > 1 && (
              <Link
                className="text-gray-900 hover:underline"
                href={`/directory?${buildQuery({ suburb, category, search, page: page - 1 })}`}
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                className="text-gray-900 hover:underline"
                href={`/directory?${buildQuery({ suburb, category, search, page: page + 1 })}`}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function buildQuery({ suburb, category, search, page }: { suburb?: string; category?: string; search?: string; page: number }) {
  const params = new URLSearchParams();
  if (suburb) params.set("suburb", suburb);
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  params.set("page", page.toString());
  return params.toString();
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
