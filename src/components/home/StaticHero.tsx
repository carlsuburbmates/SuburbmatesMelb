"use client";

import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

export function StaticHero() {
  return (
    <section
      data-testid="hero-section"
      className="relative w-full overflow-hidden flex flex-col justify-center"
      style={{
        minHeight: "100svh",
        background: "var(--bg-base)",
      }}
    >
      {/* Atmospheric blue-violet glow — top center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] animate-hero-glow"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(108, 92, 231, 0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] animate-ambient-drift"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 70% 70%, rgba(72, 52, 212, 0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-[30%] left-[-5%] w-[40%] h-[50%]"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(249, 115, 22, 0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Subtle noise grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="max-w-3xl mx-auto text-center md:text-left md:mx-0">
          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center gap-2 mb-8 animate-fade-in px-4 py-2 rounded-pill"
            style={{
              background: "var(--accent-atmosphere-muted)",
              border: "1px solid rgba(108, 92, 231, 0.18)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-atmosphere animate-pulse-dim" />
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: "var(--accent-atmosphere)" }}
            >
              Melbourne&rsquo;s Creator Discovery Platform
            </span>
          </div>

          {/* Headline — oversized display */}
          <h1
            className="animate-slide-up font-display"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              color: "var(--text-primary)",
              marginBottom: "1.5rem",
            }}
          >
            Get Your Products{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent-atmosphere) 0%, #a78bfa 50%, var(--accent-cta) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Discovered
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="animate-slide-up"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
              maxWidth: "50ch",
            }}
          >
            A new platform for digital creators to be seen. Browse by category,
            discover by region, get featured where it matters.
          </p>

          {/* CTA buttons — pill style */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <Link href="/auth/signup" className="btn-primary" data-testid="hero-cta-primary">
              Get Discovered
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/regions" className="btn-secondary" data-testid="hero-cta-secondary">
              <Compass className="w-4 h-4" />
              Explore Categories
            </Link>
          </div>
        </div>

        {/* Visual proof mockup — polished surface showing category/creator preview */}
        <div
          className="mt-16 md:mt-20 mx-auto max-w-4xl animate-slide-up rounded-2xl overflow-hidden"
          style={{
            animationDelay: "0.25s",
            background: "var(--bg-surface-1)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 8px 64px rgba(108, 92, 231, 0.10), 0 2px 16px rgba(0,0,0,0.3)",
          }}
        >
          {/* Mock browser chrome */}
          <div
            className="flex items-center gap-2 px-5 py-3.5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div
              className="flex-1 mx-4 h-6 rounded-pill px-3 flex items-center"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
            >
              <span className="text-[11px] text-ink-tertiary">suburbmates.com.au/discover</span>
            </div>
          </div>

          {/* Mock product grid */}
          <div className="p-5 grid grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { name: "Digital Art Studio", cat: "Graphics & Design", color: "rgba(108, 92, 231, 0.12)" },
              { name: "Template Lab", cat: "Templates & Tools", color: "rgba(249, 115, 22, 0.10)" },
              { name: "Content Forge", cat: "Guides & Ebooks", color: "rgba(72, 52, 212, 0.10)" },
              { name: "Brand Workshop", cat: "Business Services", color: "rgba(108, 92, 231, 0.08)" },
            ].map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: item.color,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-full aspect-[4/3] rounded-lg mb-3"
                  style={{ background: "var(--bg-surface-2)" }}
                />
                <p className="text-xs font-semibold text-ink-primary truncate">{item.name}</p>
                <p className="text-[10px] text-ink-tertiary mt-0.5">{item.cat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--bg-base), transparent)",
        }}
      />
    </section>
  );
}
