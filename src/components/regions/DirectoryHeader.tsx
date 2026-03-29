export function DirectoryHeader() {
  return (
    <section className="bg-silica border-b border-onyx">
      <div className="container-custom py-20">
        <div className="text-left max-w-4xl">
          <h1 className="font-sans font-black text-5xl md:text-7xl text-onyx tracking-tighter mb-4 leading-none uppercase">
            THE CREATOR FEED
          </h1>
          <p className="text-onyx/60 font-mono text-[10px] uppercase tracking-[0.3em] mb-8">
            Support Local Digital Talent — 6 Metro Regions
          </p>
          
          <div className="flex items-center space-x-8 text-[9px] font-black text-onyx/40 uppercase tracking-[0.2em]">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-onyx/20 mr-2" />
              Direct Outbound
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-onyx/20 mr-2" />
              Verified Assets
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-onyx/20 mr-2" />
              Zero Commission
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}