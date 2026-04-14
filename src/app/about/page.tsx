import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About SuburbMates - Melbourne's Digital Neighbourhood",
  description: "Learn about SuburbMates - connecting Melbourne's local creators with their community through a creator directory.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[60%] h-[50%]" style={{ background: "radial-gradient(ellipse 60% 50% at 15% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%]" style={{ background: "radial-gradient(ellipse 50% 50% at 80% 80%, rgba(249, 115, 22, 0.04) 0%, transparent 60%)" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="py-24 sm:py-32" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="container-custom">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-pill" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.15)" }}>
                <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>Our Story</span>
              </div>
              <h1 className="font-display mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--text-primary)" }}>
                SuburbMates: The Digital Neighbourhood
              </h1>
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "50ch" }}>
                Melbourne&rsquo;s digital neighbourhood where local creators build their brand and sell digital products. No noise. Just creators and their suburbs.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-display text-xs font-semibold mb-10" style={{ color: "var(--accent-atmosphere)" }}>Our Mission</h2>
                <div className="space-y-6">
                  <p className="text-xl leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>
                    Melbourne is full of world-class digital creators, but they often lack a local home to connect with their own community.
                  </p>
                  <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    SuburbMates is Melbourne-first — providing a creator platform where local makers build their brand and list digital products for the neighbourhood.
                  </p>
                </div>
              </div>
              <div className="p-8 rounded-2xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
                <p className="text-lg leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;We&rsquo;re building a space where neighbours can discover the talent right in their backyard, supporting local creators and making &apos;shop local&apos; a digital reality.&rdquo;
                </p>
                <div className="pt-6 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Platform Vision</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>2025 and beyond</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-24" style={{ background: "var(--bg-surface-1)" }}>
          <div className="container-custom">
            <h2 className="font-display text-xs font-semibold mb-14" style={{ color: "var(--accent-atmosphere)" }}>Platform Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: "01", title: "Local-First", desc: "Digital products shouldn't feel placeless. We connect creators to their actual neighbours." },
                { num: "02", title: "Direct Support", desc: "Platform built for Melbourne's creators, providing a stage to showcase without friction." },
                { num: "03", title: "Community Bonds", desc: "Strengthening existing community bonds within suburbs through digital proximity." },
              ].map((v) => (
                <div key={v.num} className="p-8 rounded-2xl" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                  <div className="text-xs font-bold mb-4" style={{ color: "var(--accent-atmosphere)" }}>{v.num}</div>
                  <h3 className="font-display text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-32">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h2 className="font-display mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
                Scale Your Suburb Reach.
              </h2>
              <p className="text-lg mb-10" style={{ color: "var(--text-secondary)", maxWidth: "50ch" }}>
                Whether you&rsquo;re a Melbourne creator looking to grow or a neighbour wanting to support local talent, we&rsquo;re ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/regions" className="btn-primary">Access Directory <ArrowRight className="w-4 h-4" /></a>
                <a href="/contact" className="btn-secondary">Get in Touch</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
