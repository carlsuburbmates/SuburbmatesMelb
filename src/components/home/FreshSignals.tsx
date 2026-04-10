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

/* Subtle chromatic accent per card index — muted, dark-safe */
const CARD_ACCENTS = [
  { shadow: "rgba(160, 100, 60, 0.18)",  glow: "rgba(160, 100, 60, 0.08)"  }, // warm amber
  { shadow: "rgba(70, 110, 160, 0.18)",  glow: "rgba(70, 110, 160, 0.08)"  }, // cool slate
  { shadow: "rgba(60, 120, 100, 0.18)",  glow: "rgba(60, 120, 100, 0.08)"  }, // sage green
  { shadow: "rgba(140, 80, 120, 0.18)",  glow: "rgba(140, 80, 120, 0.08)"  }, // muted mauve
  { shadow: "rgba(80, 140, 140, 0.18)",  glow: "rgba(80, 140, 140, 0.08)"  }, // teal
  { shadow: "rgba(150, 120, 60, 0.18)",  glow: "rgba(150, 120, 60, 0.08)"  }, // ochre
  { shadow: "rgba(100, 80, 160, 0.18)",  glow: "rgba(100, 80, 160, 0.08)"  }, // indigo
  { shadow: "rgba(60, 100, 80, 0.18)",   glow: "rgba(60, 100, 80, 0.08)"   }, // forest
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
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}
    >
      {/* Ambient glow — teal, top-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 85% 20%, rgba(80, 140, 140, 0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Signal
                className="w-3.5 h-3.5 animate-pulse-dim"
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Live Feed
              </span>
            </div>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "0.375rem" }}>
              Daily Discoveries
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginBottom: 0 }}>
              Fresh picks from Melbourne&apos;s digital creators.
            </p>
          </div>

          <Link
            href="/regions"
            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
            }}
          >
            Explore All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid — single col mobile, 2 col sm, 4 col md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((product, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <div
                key={product.id}
                className="group flex flex-col transition-all duration-300"
                style={{
                  background: "var(--bg-surface-1)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  boxShadow: `0 2px 12px 0 ${accent.shadow}, 0 0 0 0 transparent`,
                  transition: "box-shadow 0.3s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 4px 24px 0 ${accent.shadow}, 0 0 32px 0 ${accent.glow}`;
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 2px 12px 0 ${accent.shadow}`;
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Image placeholder — chromatic tinted surface */}
                <Link
                  href={`/api/redirect?productId=${product.id}`}
                  target="_blank"
                  onClick={() => analytics.productClick(product.id)}
                  className="relative flex overflow-hidden items-center justify-center"
                  style={{
                    aspectRatio: "4 / 3",
                    background: `linear-gradient(135deg, var(--bg-surface-2) 0%, ${accent.glow.replace('0.08', '0.18')} 100%)`,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {/* Placeholder initials */}
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      color: `${accent.shadow.replace('0.18', '0.60')}`,
                      userSelect: "none",
                    }}
                  >
                    {product.business_name?.slice(0, 2).toUpperCase() || "SM"}
                  </span>
                </Link>

                {/* Card meta */}
                <div className="p-4 flex flex-col flex-grow gap-2">
                  <Link
                    href={`/creator/${product.business_slug}`}
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                      display: "block",
                    }}
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
                      className="line-clamp-2"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        lineHeight: 1.35,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-2">
                    <Link
                      href={`/api/redirect?productId=${product.id}`}
                      target="_blank"
                      onClick={() => analytics.productClick(product.id)}
                      className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                      style={{
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                      }}
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
      className="py-16 md:py-24"
      style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}
    >
      <div className="container-custom">
        <div className="h-3 w-20 mb-3 animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
        <div className="h-7 w-52 mb-10 animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
              <div className="w-full animate-pulse" style={{ aspectRatio: "4/3", background: "var(--bg-surface-2)" }} />
              <div className="p-4 space-y-2">
                <div className="h-2.5 w-20 animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
                <div className="h-4 w-full animate-pulse" style={{ background: "var(--bg-surface-3)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
