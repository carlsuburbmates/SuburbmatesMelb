"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import Link from "next/link";
import { ArrowUpRight, Signal } from "lucide-react";
import { analytics } from "@/lib/analytics";

type ShuffledProduct = {
  id: string;
  title: string;
  description: string | null;
  image_urls: string[] | null;
  product_url: string;
  vendor_id: string;
  business_name: string;
  business_slug: string;
  created_at: string;
};

const CARD_ACCENTS = [
  { bg: "rgba(108, 92, 231, 0.08)",  border: "rgba(108, 92, 231, 0.12)" },
  { bg: "rgba(249, 115, 22, 0.06)",  border: "rgba(249, 115, 22, 0.10)" },
  { bg: "rgba(72, 52, 212, 0.07)",   border: "rgba(72, 52, 212, 0.10)" },
  { bg: "rgba(108, 92, 231, 0.05)",  border: "rgba(108, 92, 231, 0.08)" },
  { bg: "rgba(249, 115, 22, 0.05)",  border: "rgba(249, 115, 22, 0.08)" },
  { bg: "rgba(72, 52, 212, 0.06)",   border: "rgba(72, 52, 212, 0.09)" },
  { bg: "rgba(108, 92, 231, 0.06)",  border: "rgba(108, 92, 231, 0.10)" },
  { bg: "rgba(249, 115, 22, 0.04)",  border: "rgba(249, 115, 22, 0.07)" },
];

export function FreshSignals() {
  const [products, setProducts] = useState<ShuffledProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShuffle() {
      try {
        const { data, error } = await supabase.rpc("get_daily_shuffle_products", { p_limit: 8 });
        if (error) console.error("Shuffle Error:", error);
        else setProducts((data as ShuffledProduct[]) || []);
      } catch (error) {
        console.error("Fetch shuffle products error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShuffle();
  }, []);

  if (loading) return <SkeletonSection />;
  if (products.length === 0) return null;

  return (
    <section
      data-testid="fresh-signals"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--bg-surface-1)" }}
    >
      {/* Atmospheric glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[50%] h-[60%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 85% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="max-w-lg">
            <div className="flex items-center gap-2.5 mb-4">
              <Signal
                className="w-4 h-4 animate-pulse-dim"
                style={{ color: "var(--accent-atmosphere)" }}
              />
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: "var(--accent-atmosphere)" }}
              >
                Live Feed
              </span>
            </div>
            <h2
              className="font-display"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              Daily Discoveries
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: 0 }}>
              Fresh picks from Melbourne&apos;s digital creators.
            </p>
          </div>

          <Link
            href="/regions"
            className="inline-flex items-center gap-2 text-sm font-medium rounded-pill px-4 py-2 transition-all"
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            Explore All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <div
                key={product.id}
                className="group flex flex-col rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                style={{
                  background: "var(--bg-surface-2)",
                  border: `1px solid ${accent.border}`,
                }}
                data-testid={`product-card-${i}`}
              >
                {/* Image placeholder */}
                <Link
                  href={`/api/redirect?productId=${product.id}`}
                  target="_blank"
                  onClick={() => analytics.productClick(product.id)}
                  className="relative flex overflow-hidden items-center justify-center rounded-t-2xl"
                  style={{
                    aspectRatio: "4 / 3",
                    background: `linear-gradient(135deg, var(--bg-surface-3) 0%, ${accent.bg} 100%)`,
                  }}
                >
                  <span
                    className="text-2xl font-display font-bold select-none"
                    style={{ color: accent.border }}
                  >
                    {product.business_name?.slice(0, 2).toUpperCase() || "SM"}
                  </span>
                </Link>

                {/* Card meta */}
                <div className="p-4 flex flex-col flex-grow gap-2">
                  <Link
                    href={`/creator/${product.business_slug}`}
                    className="text-xs font-medium tracking-wide transition-colors hover:text-ink-primary"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {product.business_name}
                  </Link>

                  <Link
                    href={`/api/redirect?productId=${product.id}`}
                    target="_blank"
                    onClick={() => analytics.productClick(product.id)}
                    className="block"
                  >
                    <h3
                      className="line-clamp-2 font-display"
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.35,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-3">
                    <Link
                      href={`/api/redirect?productId=${product.id}`}
                      target="_blank"
                      onClick={() => analytics.productClick(product.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5"
                      style={{ color: "var(--accent-atmosphere)" }}
                    >
                      Visit <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkeletonSection() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "var(--bg-surface-1)" }}
    >
      <div className="container-custom">
        <div className="h-3 w-20 mb-4 animate-pulse rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
        <div className="h-8 w-52 mb-12 animate-pulse rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
            >
              <div className="w-full animate-pulse" style={{ aspectRatio: "4/3", background: "var(--bg-surface-3)" }} />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 animate-pulse rounded" style={{ background: "var(--bg-surface-3)" }} />
                <div className="h-4 w-full animate-pulse rounded" style={{ background: "var(--bg-surface-3)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
