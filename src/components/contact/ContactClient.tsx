"use client";

import { Container } from "@/components/layout/Container";
import { Mail, MessageSquare, ArrowRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  { question: "How do I create a creator profile?", answer: "Click 'Sign up' in the header and select 'Creator'. Fill in your details and we'll review your profile." },
  { question: "What does it cost?", answer: "Basic listing is completely free. Featured placements are available for a small flat fee." },
  { question: "How do I sell digital products?", answer: "Once your profile is active, add products from your dashboard. Visitors are routed directly to your external assets." },
  { question: "How do payments work?", answer: "Suburbmates routes traffic to your site. You handle checkout on your own infrastructure — zero commission." },
];

export function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!response.ok) throw new Error("Failed to send message");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-pill" style={{ background: "var(--accent-atmosphere-muted)", border: "1px solid rgba(108, 92, 231, 0.15)" }}>
              <span className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>Contact</span>
            </div>
            <h1 className="font-display mb-5" style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--text-primary)" }}>
              Get in Touch
            </h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Direct channel to the founding team. Share your inquiries or feedback.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-20">
        <div className="grid md:grid-cols-5 gap-16">
          {/* Sidebar */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-xs font-semibold mb-4" style={{ color: "var(--accent-atmosphere)" }}>Direct</h2>
              <a href="mailto:hello@suburbmates.com.au" className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-white/5 group" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>hello@suburbmates.com.au</span>
                </div>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }} />
              </a>
            </div>
            <div className="p-6 rounded-xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Help Centre</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: "var(--text-tertiary)" }}>Check our documentation for quick answers.</p>
              <Link href="/help" className="btn-secondary w-full justify-center !text-sm">View Help Centre</Link>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="p-8 md:p-10 rounded-2xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)", boxShadow: "0 8px 48px rgba(0,0,0,0.2)" }}>
              <h2 className="font-display text-xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>Send a Message</h2>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--accent-atmosphere)" }} />
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message Received</h3>
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Thank you. Our team will respond shortly.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-sm font-medium" style={{ color: "var(--accent-atmosphere)" }}>Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Name</label>
                      <input id="name" type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Your name" className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
                      <input id="email" type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="name@email.com" className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Subject</label>
                    <input id="subject" type="text" name="subject" required value={formData.subject} onChange={handleInputChange} placeholder="What's this about?" className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Message</label>
                    <textarea id="message" name="message" rows={5} required value={formData.message} onChange={handleInputChange} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-30">{isSubmitting ? "Sending..." : "Send Message"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* FAQ */}
      <div className="py-24" style={{ background: "var(--bg-surface-1)", borderTop: "1px solid var(--border)" }}>
        <Container className="max-w-4xl">
          <h2 className="font-display text-center mb-14" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Common Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                <h3 className="font-display text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>{faq.question}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", marginBottom: 0 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
