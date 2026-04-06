export function DirectoryHeader() {
  return (
    <section className="bg-ink-base border-b border-white/10 relative overflow-hidden">
      {/* Ambient background glow matching the design system */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      
      <div className="container-custom py-28 relative z-10">
        <div className="text-left max-w-4xl">
          <h1 className="font-sans font-bold text-5xl md:text-7xl text-ink-primary tracking-tight mb-4 leading-none uppercase">
            THE CREATOR FEED
          </h1>
          <p className="text-ink-secondary font-mono text-xs uppercase tracking-widest mb-8">
            Support Local Digital Talent — 6 Metro Regions
          </p>
          
          <div className="flex items-center space-x-8 text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 mr-2" />
              Direct Outbound Linkages
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 mr-2" />
              Verified Local Assets
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}