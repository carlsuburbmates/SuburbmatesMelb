export function DirectoryHeader() {
  return (
    <section style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }} className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[80%]" style={{ background: "radial-gradient(ellipse 60% 50% at 80% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)" }} />
      </div>
      <div className="container-custom py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-pill" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.15)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>Creator Directory</span>
          </div>
          <h1 className="font-display mb-4" style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--text-primary)" }}>
            The Creator Feed
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Support local digital talent across Melbourne&apos;s 6 Metro Regions.
          </p>
          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-atmosphere)" }} />Direct Outbound</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-cta)" }} />Verified Creators</span>
          </div>
        </div>
      </div>
    </section>
  );
}
