"use client";

import { ArrowRight, Calendar, User, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/layout/Container";

export function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "HOW LOCAL CREATORS THRIVE IN MELBOURNE'S DIGITAL AGE",
      excerpt:
        "DISCOVER STRATEGIES FOR MELBOURNE CREATIVES TO SUCCEED IN THE DIGITAL MARKETPLACE AND CONNECT WITH LOCAL COMMUNITIES EFFECTIVELY.",
      author: "SARAH JOHNSON",
      date: "2024-11-15",
      readTime: "5 MIN READ",
      category: "business",
      slug: "local-business-digital-age",
    },
    {
      id: 2,
      title: "THE RISE OF DIGITAL ASSETS: SYSTEMATIC OVERHAUL",
      excerpt:
        "LEARN ABOUT DIGITAL PRODUCT TRENDS AND HOW MELBOURNE STUDIOS CAN LEVERAGE THEM TO INCREASE REACH AND ENGAGEMENT.",
      author: "MICHAEL CHEN",
      date: "2024-11-10",
      readTime: "7 MIN READ",
      category: "digital-products",
      slug: "digital-products-trends",
    },
    {
      id: 3,
      title: "BUILDING COMMUNITY: SPATIAL CONNECTIONS",
      excerpt:
        "EXPLORE HOW SUBURBMATES IS HELPING MELBOURNE CREATIVES BUILD STRONGER RELATIONSHIPS WITH THEIR NEIGHBOURHOODS.",
      author: "EMMA WILLIAMS",
      date: "2024-11-05",
      readTime: "4 MIN READ",
      category: "community",
      slug: "melbourne-community-connections",
    },
    {
      id: 4,
      title: "SUCCESS PROTOCOLS: STUDIO CASE STUDIES",
      excerpt:
        "REAL EXAMPLES OF HOW MELBOURNE STUDIOS HAVE GROWN THEIR PRESENCE AND INFLUENCE THROUGH SUBURBMATES.",
      author: "DAVID MARTINEZ",
      date: "2024-10-28",
      readTime: "6 MIN READ",
      category: "success-stories",
      slug: "melbourne-business-success",
    },
    {
      id: 5,
      title: "MARKETING TACTICS FOR THE MODERN STUDIO",
      excerpt:
        "PRACTICAL DIGITAL STRATEGIES SPECIFICALLY TAILORED FOR MELBOURNE CREATIVES LOOKING TO EXPAND THEIR Reach.",
      author: "LISA ANDERSON",
      date: "2024-10-20",
      readTime: "8 MIN READ",
      category: "marketing",
      slug: "digital-marketing-tips",
    },
    {
      id: 6,
      title: "MELBOURNE'S EVOLVING LANDSCAPE: FUTURE SYSTEMS",
      excerpt:
        "INSIGHTS INTO MELBOURNE'S CHANGING CREATIVE ENVIRONMENT AND HOW LOCAL ENTREPRENEURS CAN ADAPT AND THRIVE.",
      author: "ROBERT TAYLOR",
      date: "2024-10-15",
      readTime: "5 MIN READ",
      category: "trends",
      slug: "melbourne-business-future",
    },
  ];

  const categories = [
    { id: "all", name: "ALL LOGS" },
    { id: "business", name: "STUDIO" },
    { id: "digital-products", name: "ASSETS" },
    { id: "community", name: "CONTEXT" },
    { id: "success-stories", name: "REPORTS" },
    { id: "marketing", name: "TACTICS" },
    { id: "trends", name: "INTEL" },
  ];

  const filteredPosts =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-white/10">
        <Container className="py-24 md:py-32">
          <div className="max-w-4xl">
            <span className="text-[10px] font-black text-ink-tertiary uppercase tracking-[0.5em] mb-6 block">
              INTEL / ARCHIVE
            </span>
            <h1 className="text-5xl md:text-8xl font-extrabold text-ink-primary uppercase tracking-tighter leading-[0.85] mb-8">
              STUDIO LOGS
            </h1>
            <p className="text-xl text-ink-secondary leading-relaxed uppercase tracking-tight max-w-2xl font-medium">
              Systematic insights and strategic reports for Melbourne&rsquo;s creative collective.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-20">
        {/* Category Filter - Clinical Tabs */}
        <div className="mb-20 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  activeCategory === category.id
                    ? "bg-white text-black border-white"
                    : "bg-black text-ink-tertiary border-white/10 hover:border-white/30"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid - High Precision Spatial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-black p-8 group hover:bg-ink-surface-1 transition-all flex flex-col min-h-[450px]"
            >
              <div className="mb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-ink-primary border border-white/10 px-2 py-0.5 uppercase tracking-tighter bg-white/5">
                    {post.category.replace("-", " ")}
                  </span>
                  <div className="flex items-center text-[9px] font-bold text-ink-tertiary uppercase tracking-widest gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-ink-primary uppercase tracking-tighter leading-[1.2] group-hover:text-ink-secondary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-ink-tertiary text-xs leading-relaxed uppercase tracking-wide line-clamp-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-ink-tertiary" />
                  <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">{post.author}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-[10px] font-black text-ink-primary uppercase tracking-widest hover:translate-x-1 transition-transform"
                >
                  ACCESS LOG
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Intelligence Update CTA */}
        <div className="mt-32 bg-ink-surface-1 border border-white/5 p-12 md:p-20 text-left relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black text-ink-primary uppercase tracking-tighter mb-6">
              SUBSCRIBE TO THE PROTOCOL
            </h2>
            <p className="text-ink-secondary uppercase tracking-widest text-sm mb-12 leading-relaxed font-medium">
              Join 2,500+ Melbourne creators receiving weekly strategic intel. Direct to your terminal.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="ENDPOINT@EMAIL.COM"
                className="flex-1 bg-black border border-white/10 px-6 py-4 text-[10px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/20 transition-all"
              />
              <button className="px-12 py-4 bg-ink-primary text-black text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-opacity">
                INITIALIZE
              </button>
            </div>
          </div>
          <Zap className="absolute right-[-5%] bottom-[-10%] w-64 h-64 text-white/5 rotate-12" />
        </div>
      </Container>
    </div>
  );
}
