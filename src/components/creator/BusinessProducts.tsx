"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { analytics } from "@/lib/analytics";

interface BusinessProductsProps {
  vendorId?: string;
  businessId?: string;
  limit?: number;
  vendorProfile?: {
    name: string;
    slug: string;
    imageUrl?: string;
    isVerified?: boolean;
  };
}

export function BusinessProducts({ vendorId, limit }: BusinessProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendorId) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/products?vendor_id=${vendorId}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [vendorId]);

  const filteredProducts = products.filter((product) => {
    const text = searchQuery.toLowerCase();
    return product.title?.toLowerCase().includes(text);
  });

  const isPreview = !!limit;
  const displayProducts = isPreview ? products.slice(0, limit) : filteredProducts;

  if (loading) return <SkeletonGrid limit={limit} />;
  if (products.length === 0) return null;

  return (
    <div data-testid="business-products">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="space-y-2">
          <h3
            className="flex items-center gap-2 font-display text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            <Zap className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />
            Studio Collection
          </h3>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Verified digital assets and professional output.
          </p>
        </div>

        {!isPreview && products.length > 3 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <input
              type="text"
              placeholder="Search catalogue..."
              className="w-full h-10 pl-10 pr-3 text-sm rounded-xl focus:outline-none transition-all"
              style={{
                background: "var(--bg-surface-1)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="products-search"
            />
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
            style={{
              background: "var(--bg-surface-1)",
              border: "1px solid var(--border)",
            }}
            data-testid={`product-item-${product.id}`}
          >
            <Link
              href={`/api/redirect?productId=${product.id}`}
              target="_blank"
              onClick={() => analytics.productClick(product.id as string)}
              className="aspect-square relative overflow-hidden block"
            >
              {Array.isArray(product.image_urls) && product.image_urls[0] ? (
                <Image
                  src={product.image_urls[0] as string}
                  alt={product.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "var(--bg-surface-2)" }}
                >
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    No Preview
                  </span>
                </div>
              )}
            </Link>

            <div className="p-5 flex flex-col">
              <span className="text-[11px] font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
                {product.category_id ? `Category ${product.category_id}` : "General"}
              </span>
              <Link
                href={`/api/redirect?productId=${product.id}`}
                target="_blank"
                onClick={() => analytics.productClick(product.id as string)}
                className="block mb-4"
              >
                <h4
                  className="font-display font-bold leading-tight line-clamp-2"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                >
                  {product.title}
                </h4>
              </Link>

              <div className="mt-auto pt-4 flex justify-between items-center" style={{ borderTop: "1px solid var(--border)" }}>
                <Link
                  href={`/api/redirect?productId=${product.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5"
                  style={{ color: "var(--accent-atmosphere)" }}
                  onClick={() => analytics.productClick(product.id as string)}
                >
                  View Full Asset
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  Studio Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && searchQuery && (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}
        >
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            No matching results found
          </span>
        </div>
      )}
    </div>
  );
}

function SkeletonGrid({ limit }: { limit?: number }) {
  return (
    <div className="space-y-8">
      <div className="h-6 w-48 rounded-lg animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(limit || 3)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
            <div className="w-full aspect-square animate-pulse" style={{ background: "var(--bg-surface-2)" }} />
            <div className="p-5 space-y-3">
              <div className="w-2/3 h-4 rounded-lg animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
              <div className="w-1/2 h-3 rounded-lg animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
