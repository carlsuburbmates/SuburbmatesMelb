"use client";

import { Container } from "@/components/layout/Container";
import { Modal } from "@/components/ui/modal";
import { BookOpen, Mail, MessageSquare, Info, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function HelpClient() {
  const [activeTab, setActiveTab] = useState("faq");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    { question: "How do I create a creator profile?", answer: "Click 'Sign up' in the header and select 'Creator'. Fill in your details including your studio name and description. We review profiles to ensure quality." },
    { question: "How much does it cost?", answer: "Basic listing is completely free. Featured placements are available for a small flat fee. No subscriptions, no commission." },
    { question: "How do I list digital products?", answer: "Once your profile is active, go to your dashboard and click 'Add Product'. Add your product URL and details — visitors are routed directly to your site." },
    { question: "How do payments work?", answer: "Suburbmates routes visitors to your external site. You handle checkout on your infrastructure — we take zero commission." },
    { question: "Can I cancel anytime?", answer: "Yes. There's nothing to cancel with the free tier. Featured placements are one-time payments with no recurring fees." },
    { question: "How do I update my profile?", answer: "Log into your dashboard and navigate to 'Settings'. Changes are reflected immediately on your public profile." },
    { question: "What exactly is SuburbMates?", answer: "SuburbMates is a creator discovery platform and directory. We provide the tools to host a professional page and get discovered, but we're not a marketplace — we route traffic directly to you." },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), subject: formData.get("subject"), message: formData.get("message") }) });
      if (!response.ok) throw new Error("Failed");
      alert("Message sent successfully!");
      setIsContactModalOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch { alert("Failed to send. Please try again."); } finally { setIsSubmitting(false); }
  };

  const tabs = [
    { id: "faq", label: "FAQ", icon: Info },
    { id: "support", label: "Support", icon: BookOpen },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden" style={{ background: "var(--bg-surface-1)", borderBottom: "1px solid var(--border)" }}>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[80%]" style={{ background: "radial-gradient(ellipse 60% 50% at 80% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)" }} />
        </div>
        <Container className="py-20 sm:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-pill" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.15)" }}>
              <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>Support</span>
            </div>
            <h1 className="font-display mb-5" style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--text-primary)" }}>Help Centre</h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Find answers to common questions or get in touch with our team.</p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar nav */}
            <aside className="lg:col-span-3">
              <nav className="flex flex-row lg:flex-col gap-2">
                {tabs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex items-center gap-2.5 px-4 py-3 text-left rounded-xl transition-all text-sm font-medium w-full" style={{ background: activeTab === item.id ? "var(--accent-atmosphere-muted)" : "transparent", color: activeTab === item.id ? "var(--accent-atmosphere)" : "var(--text-tertiary)", border: activeTab === item.id ? "1px solid rgba(108, 92, 231, 0.15)" : "1px solid transparent" }} data-testid={`help-tab-${item.id}`}>
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <div className="lg:col-span-9">
              <div className="rounded-2xl p-6 sm:p-10 min-h-[500px]" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)" }}>
                {activeTab === "faq" && (
                  <div className="space-y-3">
                    <h2 className="font-display text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Frequently Asked Questions</h2>
                    {faqs.map((faq, index) => (
                      <FAQItem key={index} faq={faq} index={index} />
                    ))}
                  </div>
                )}

                {activeTab === "support" && (
                  <div className="space-y-6">
                    <h2 className="font-display text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Support Options</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: BookOpen, title: "Documentation", desc: "Quick guides and tutorials", action: "Read Docs", href: "#" },
                        { icon: Mail, title: "Email Support", desc: "Get help from the founder", action: "Email Us", href: "mailto:hello@suburbmates.com.au" },
                      ].map((opt, i) => {
                        const Icon = opt.icon;
                        return (
                          <div key={i} className="p-6 rounded-xl transition-all group" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-4" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.12)" }}>
                              <Icon className="w-5 h-5" style={{ color: "var(--accent-atmosphere)" }} />
                            </div>
                            <h3 className="font-display text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>{opt.title}</h3>
                            <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>{opt.desc}</p>
                            <a href={opt.href} className="btn-primary !text-sm !py-2.5 w-full justify-center">{opt.action}</a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <h2 className="font-display text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Get in Touch</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: Mail, label: "Email", value: "hello@suburbmates.com.au" },
                        { icon: MessageSquare, label: "Hours", value: "Mon - Fri: 9am - 5pm AEST" },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex items-start gap-3.5 p-5 rounded-xl" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                            <Icon className="w-4 h-4 mt-0.5" style={{ color: "var(--accent-atmosphere)" }} />
                            <div>
                              <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-tertiary)" }}>{item.label}</p>
                              <p className="text-sm font-medium" style={{ color: "var(--text-primary)", marginBottom: 0 }}>{item.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-6 rounded-xl text-center" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                      <h3 className="font-display text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Send a Message</h3>
                      <p className="text-sm mb-5" style={{ color: "var(--text-tertiary)" }}>Need a faster response? Reach out directly.</p>
                      <button onClick={() => setIsContactModalOpen(true)} className="btn-primary !text-sm" data-testid="help-contact-cta">Send Message</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom CTA */}
      <section className="py-24 text-center" style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}>
        <div className="container-custom">
          <h2 className="font-display mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Still have questions?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>We&apos;re here to help you succeed on SuburbMates.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@suburbmates.com.au" className="btn-primary">Email Us</a>
            <Link href="/regions" className="btn-secondary">Browse Directory</Link>
          </div>
        </div>
      </section>

      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title="Send a Message">
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="c-name" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Name</label>
              <input type="text" id="c-name" name="name" required placeholder="Your name" className="w-full h-10 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label htmlFor="c-email" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input type="email" id="c-email" name="email" required placeholder="Email" className="w-full h-10 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div>
            <label htmlFor="c-subject" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Subject</label>
            <input type="text" id="c-subject" name="subject" required placeholder="Subject" className="w-full h-10 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label htmlFor="c-message" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Message</label>
            <textarea id="c-message" name="message" rows={4} required placeholder="Your message..." className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-30">{isSubmitting ? "Sending..." : "Send Message"}</button>
        </form>
      </Modal>
    </>
  );
}

function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden transition-all" style={{ background: isOpen ? "var(--bg-surface-2)" : "transparent", border: `1px solid ${isOpen ? "rgba(108, 92, 231, 0.12)" : "var(--border)"}` }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left" data-testid={`help-faq-${index}`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tabular-nums" style={{ color: "var(--accent-atmosphere)", minWidth: "1.25rem" }}>0{index + 1}</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{faq.question}</span>
        </div>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-300" style={{ color: "var(--text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? "200px" : "0", opacity: isOpen ? 1 : 0 }}>
        <p className="px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>{faq.answer}</p>
      </div>
    </div>
  );
}
