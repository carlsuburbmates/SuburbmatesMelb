export function DirectoryHeader() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="container-custom py-16">
        <div className="text-left max-w-4xl">
          <h1 className="text-5xl font-extrabold text-black tracking-tighter mb-4 leading-none uppercase">
            Melbourne Creator Directory
          </h1>
          <p className="text-xl text-slate-800 font-medium mb-8 max-w-2xl leading-relaxed">
            Discover professional creators in your neighbourhood. 
            High-density discovery for Melbourne&apos;s digital economy.
          </p>
          <div className="flex items-center space-x-6 text-[10px] font-black text-black uppercase tracking-[0.2em]">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-black mr-2 shrink-0" />
              Free Listings
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-black mr-2 shrink-0" />
              Verified Creators
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-black mr-2 shrink-0" />
              Melbourne-Wide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}