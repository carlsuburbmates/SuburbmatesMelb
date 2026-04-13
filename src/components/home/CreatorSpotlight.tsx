"use client";

import { useEffect, useState, useRef } from "react";
import supabase from "@/lib/supabase";
import Link from "next/link";
import { ArrowUpRight, Star, ChevronLeft, ChevronRight } from "lucide-react";

type SpotlightCreator = {
  id: string;
  business_name: string;
  profile_description: string | null;
  slug: string;
  suburb_label: string | null;
  category_name: string | null;
};

export function CreatorSpotlight() {
  const [creators, setCreators] = useState<SpotlightCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    async function fetchSpotlight() {
      try {
        // Fetch currently featured creators via active featured_slots
        const now = new Date().toISOString();
        const { data: slots, error } = await supabase
          .from("featured_slots")
          .select("business_profile_id, suburb_label")
          .eq("status", "active")
          .lte("start_date", now)
          .gte("end_date", now)
          .limit(8);

        if (error || !slots?.length) {
          // Fallback: show random active creators
          const { data: fallback } = await supabase
            .from("business_profiles")
            .select("id, business_name, profile_description, slug, category_id")
            .eq("is_public", true)
            .eq("vendor_status", "active")
            .limit(6);

          if (fallback?.length) {
            setCreators(
              fallback.map((c) => ({
                id: c.id,
                business_name: c.business_name,
                profile_description: c.profile_description,
                slug: c.slug,
                suburb_label: null,
                category_name: null,
              }))
            );
          }
          setLoading(false);
          return;
        }

        // Fetch profile details for featured creators
        const profileIds = slots.map((s) => s.business_profile_id);
        const { data: profiles } = await supabase
          .from("business_profiles")
          .select("id, business_name, profile_description, slug, category_id")
          .in("id", profileIds)
          .eq("is_public", true);

        if (profiles?.length) {
          const slotMap = new Map(slots.map((s) => [s.business_profile_id, s.suburb_label]));
          setCreators(
            profiles.map((p) => ({
              id: p.id,
              business_name: p.business_name,
              profile_description: p.profile_description,
              slug: p.slug,
              suburb_label: slotMap.get(p.id) ?? null,
              category_name: null,
            }))
          );
        }
      } catch (err) {
        console.error("Spotlight fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpotlight();
  }, []);

  // Auto-rotate every 5s
  useEffect(() => {
    if (creators.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % creators.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [creators.length]);

  // Scroll to active card on mobile
  useEffect(() => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[activeIndex] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % creators.length);
    }, 5000);
  };

  if (loading) return <SpotlightSkeleton />;
  if (creators.length === 0) return null;

  const active = creators[activeIndex];

  return (
    <section
      data-testid="creator-spotlight"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--bg-surface-1)" }}
    >
      {/* Atmospheric glow — follows active card */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%] transition-all duration-1000"
          style={{
            background: "radial-gradient(ellipse 50% 40% at 50% 50%, var(--accent-atmosphere-glow) 0%, transparent 70%)",
            opacity: 0.5,
          }}
        />
      </div>

      <div className="relative z-10 container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Star className="w-4 h-4" style={{ color: "var(--accent-cta)" }} />
              <span className="text-xs font-medium tracking-wide" style={{ color: "var(--accent-cta)" }}>
                Creator Spotlight
              </span>
            </div>
            <h2
              className="font-display"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              In the Spotlight
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: 0 }}>
              Creators making waves across Melbourne.
            </p>
          </div>

          {/* Desktop nav arrows */}
          {creators.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => goTo((activeIndex - 1 + creators.length) % creators.length)}
                className="p-2.5 rounded-xl transition-all hover:bg-white/5"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                aria-label="Previous creator"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goTo((activeIndex + 1) % creators.length)}
                className="p-2.5 rounded-xl transition-all hover:bg-white/5"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                aria-label="Next creator"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Spotlight hero card */}
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden transition-all duration-700"
          style={{
            background: "var(--bg-surface-2)",
            border: "1px solid rgba(108, 92, 231, 0.15)",
            boxShadow: "0 0 48px var(--accent-atmosphere-soft), 0 8px 32px rgba(0,0,0,0.3)",
            minHeight: "280px",
          }}
        >
          {/* Ambient corner glow */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full transition-opacity duration-700"
            style={{ background: "var(--accent-atmosphere-glow)", filter: "blur(60px)" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1 min-w-0">
              {/* Spotlight badge */}
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-pill"
                style={{
                  background: "linear-gradient(135deg, var(--accent-atmosphere), var(--accent-indigo))",
                }}
              >
                <Star className="w-3 h-3 text-white fill-white" />
                <span className="text-xs font-semibold text-white">Spotlight</span>
              </div>

              {/* Category / region */}
              <div className="flex items-center gap-3 mb-3">
                {active.category_name && (
                  <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>
                    {active.category_name}
                  </span>
                )}
                {active.suburb_label && (
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {active.suburb_label}
                  </span>
                )}
              </div>

              {/* Creator name — cinematic display */}
              <h3
                className="font-display mb-4 transition-all duration-500"
                style={{
                  fontSize: "clamp(1.75rem, 5vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                }}
              >
                {active.business_name}
              </h3>

              <p
                className="line-clamp-3 text-base leading-relaxed max-w-xl mb-6 transition-all duration-500"
                style={{ color: "var(--text-secondary)" }}
              >
                {active.profile_description || "Digital creator & professional services based in Melbourne."}
              </p>

              <Link
                href={`/creator/${active.slug}`}
                className="btn-primary !text-sm"
                data-testid="spotlight-cta"
              >
                Explore Portfolio
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right side: initials/visual */}
            <div
              className="hidden md:flex w-40 h-40 rounded-2xl items-center justify-center flex-shrink-0 transition-all duration-700"
              style={{
                background: "linear-gradient(135deg, var(--accent-atmosphere-muted), rgba(72, 52, 212, 0.10))",
                border: "1px solid rgba(108, 92, 231, 0.12)",
              }}
            >
              <span
                className="font-display text-5xl font-bold select-none transition-all duration-500"
                style={{ color: "var(--accent-atmosphere)" }}
              >
                {active.business_name?.slice(0, 2).toUpperCase() || "SM"}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail carousel */}
        {creators.length > 1 && (
          <div className="mt-6">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {creators.map((creator, index) => (
                <button
                  key={creator.id}
                  onClick={() => goTo(index)}
                  className="flex-shrink-0 snap-center p-4 rounded-xl transition-all duration-300 text-left min-w-[200px]"
                  style={{
                    background: index === activeIndex ? "var(--accent-atmosphere-muted)" : "var(--bg-surface-2)",
                    border: index === activeIndex
                      ? "1px solid rgba(108, 92, 231, 0.25)"
                      : "1px solid var(--border)",
                    opacity: index === activeIndex ? 1 : 0.6,
                  }}
                  data-testid={`spotlight-thumb-${index}`}
                >
                  <p
                    className="text-sm font-semibold truncate mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {creator.business_name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {creator.suburb_label || "Melbourne"}
                  </p>
                </button>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {creators.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className="transition-all duration-300"
                  style={{
                    width: index === activeIndex ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: index === activeIndex ? "var(--accent-atmosphere)" : "rgba(255,255,255,0.15)",
                  }}
                  aria-label={`Go to creator ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SpotlightSkeleton() {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg-surface-1)" }}>
      <div className="container-custom">
        <div className="mb-14 space-y-3">
          <div className="h-3 w-28 animate-pulse rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
          <div className="h-10 w-64 animate-pulse rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
        </div>
        <div className="rounded-2xl p-10 animate-pulse" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", minHeight: "280px" }}>
          <div className="h-6 w-20 mb-6 rounded-pill" style={{ background: "var(--bg-surface-3)" }} />
          <div className="h-10 w-1/2 mb-4 rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
          <div className="h-4 w-2/3 rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
        </div>
      </div>
    </section>
  );
}
