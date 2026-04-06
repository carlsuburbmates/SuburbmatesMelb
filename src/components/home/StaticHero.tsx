"use client";

export function StaticHero() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col justify-end"
      style={{
        minHeight: "100svh",
        background: "var(--bg-base)",
        paddingBottom: "calc(var(--mobile-nav-h) + 2rem)",
      }}
    >
      {/* Radial ambient glows — layered depth, no image needed */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            /* Warm amber glow — top left */
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(180, 120, 60, 0.12) 0%, transparent 65%)",
            /* Cool slate glow — top right */
            "radial-gradient(ellipse 60% 45% at 85% 10%, rgba(80, 100, 140, 0.10) 0%, transparent 60%)",
            /* Deep sage undertone — mid */
            "radial-gradient(ellipse 80% 40% at 50% 60%, rgba(60, 100, 90, 0.07) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p
            className="mb-4 animate-fade-in"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              lineHeight: 1,
            }}
          >
            Melbourne&rsquo;s Top Digital Creators
          </p>

          {/* Headline */}
          <h1
            className="animate-slide-up"
            style={{
              fontSize: "clamp(2rem, 9vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
            }}
          >
            Build Your Brand
          </h1>

          {/* Sub-copy */}
          <p
            className="animate-slide-up"
            style={{
              fontSize: "clamp(0.875rem, 2.5vw, 1.0625rem)",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "2rem",
              maxWidth: "42ch",
            }}
          >
            Drops, products, collections — discover Melbourne&rsquo;s
            digital creators. Direct outbound routing.
          </p>
        </div>
      </div>
    </section>
  );
}
