import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SuburbMates - Melbourne's Digital Neighbourhood",
  description:
    "Learn about SuburbMates - connecting Melbourne's local creators with their community through a creator directory.",
  keywords:
    "about, Melbourne creators, local marketplace, digital directory, community platform",
  openGraph: {
    title: "About SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connecting Melbourne's local creators with their community through a creator directory.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SuburbMates - Melbourne's Digital Neighbourhood",
    description:
      "Connecting Melbourne's local creators with their community through a creator directory.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-base relative overflow-hidden selection:bg-white selection:text-black">
      {/* Radial ambient glows — layered depth matching homepage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(180, 120, 60, 0.08) 0%, transparent 65%)",
            "radial-gradient(ellipse 60% 45% at 85% 10%, rgba(100, 80, 140, 0.07) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 40% at 50% 60%, rgba(60, 100, 90, 0.05) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-transparent border-b border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="container-custom py-24 sm:py-32 relative z-10">
            <div className="max-w-4xl">
              <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.5em] mb-4 block underline decoration-white/20 underline-offset-8">
                Protocol: Origin Story
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-ink-primary mb-8 tracking-tighter uppercase leading-none">
                SuburbMates: The Digital <br className="hidden md:block" /> Neighbourhood
              </h1>
              <p className="text-xl text-ink-secondary leading-relaxed tracking-tight max-w-2xl font-medium">
                Melbourne&rsquo;s digital neighbourhood where local creators build
                their brand and sell digital products. No noise. Just creators and their suburbs.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-24 bg-transparent">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-xs font-bold text-ink-primary uppercase tracking-[0.5em] mb-12 border-l-2 border-white/20 pl-6">
                  Our Mission
                </h2>
                <div className="space-y-8">
                  <p className="text-xl text-ink-primary leading-relaxed font-medium">
                    Melbourne is full of world-class digital creators, but they often lack a local home to connect with their own community.
                  </p>
                  <p className="text-lg text-ink-secondary leading-relaxed font-light">
                    SuburbMates is Melbourne-first — providing a creator platform where local makers build their brand and list digital products for the neighbourhood.
                  </p>
                </div>
              </div>
              <div className="bg-ink-surface-1 p-8 rounded-sm border border-white/5 space-y-8 backdrop-blur-sm">
                <p className="text-lg text-ink-secondary leading-relaxed font-light italic opacity-80">
                  &ldquo;We&rsquo;re building a space where neighbours can discover the talent right in their backyard, supporting local creators and making 'shop local' a digital reality.&rdquo;
                </p>
                <div className="pt-8 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-sm"></div>
                    <div>
                      <div className="text-[10px] font-bold text-ink-primary uppercase tracking-widest">Platform Core</div>
                      <div className="text-[10px] font-medium text-ink-tertiary uppercase tracking-widest">Vision 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-24 bg-ink-surface-1/50 border-y border-white/5 backdrop-blur-sm">
          <div className="container-custom">
            <div className="max-w-4xl">
              <h2 className="text-xs font-bold text-ink-primary uppercase tracking-[0.5em] mb-16">
                Platform Values
              </h2>
              <div className="grid md:grid-cols-3 gap-12 sm:gap-16">
                <div>
                  <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mb-4 opacity-50 font-mono">01/</div>
                  <h3 className="text-sm font-bold text-ink-primary mb-4 uppercase tracking-widest">
                    Local-First
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed font-medium tracking-wide uppercase">
                    Digital products shouldn&rsquo;t feel placeless. We connect creators to their actual neighbours.
                  </p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mb-4 opacity-50 font-mono">02/</div>
                  <h3 className="text-sm font-bold text-ink-primary mb-4 uppercase tracking-widest">
                    Direct Support
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed font-medium tracking-wide uppercase">
                    Platform built for Melbourne&rsquo;s creators, providing a stage to showcase without friction.
                  </p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mb-4 opacity-50 font-mono">03/</div>
                  <h3 className="text-sm font-bold text-ink-primary mb-4 uppercase tracking-widest">
                    Bonds
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed font-medium tracking-wide uppercase">
                    Strengthening existing community bonds within suburbs through digital proximity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-32 bg-transparent overflow-hidden relative">
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-5xl font-bold text-ink-primary mb-8 uppercase tracking-tighter leading-none">
                Scale Your Suburb Reach.
              </h2>
              <p className="text-lg text-ink-secondary mb-12 max-w-xl font-medium tracking-tight">
                Whether you&rsquo;re a Melbourne creator looking to grow or a neighbour
                wanting to support local talent, our protocols are ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="/regions" className="bg-white text-ink-base px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all rounded-sm text-center">
                  Access Directory
                </a>
                <a href="/contact" className="border border-white/20 text-ink-primary px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all rounded-sm text-center">
                  Establish Contact
                </a>
              </div>
            </div>
          </div>
          {/* Decorative Edge Glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
