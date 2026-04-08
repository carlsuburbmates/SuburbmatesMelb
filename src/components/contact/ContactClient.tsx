"use client";

import { Container } from "@/components/layout/Container";
import { Mail, MessageSquare, ArrowRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "HOW DO I INITIALIZE A STUDIO PROFILE?",
    answer:
      "SELECT 'SIGN UP' AND CHOOSE THE 'CREATOR' PATHWAY. PROVIDE YOUR IDENTIFICATION AND STUDIO DETAILS FOR SYSTEM VERIFICATION.",
  },
  {
    question: "WHAT IS THE FISCAL REQUIREMENT?",
    answer:
      "STANDARD DIRECTORY LISTING IS FREE. WE OFFER PREMIUM DEPLOYMENT TIERS FOR CREATIVES REQUIRING ENHANCED ASSET VISIBILITY.",
  },
  {
    question: "HOW ARE DIGITAL ASSETS DISTRIBUTED?",
    answer:
      "UPON VERIFICATION, STUDIOS CAN UPLOAD ASSETS DIRECTLY VIA THE DASHBOARD. THESE ARE INDEXED AND MADE DISCOVERABLE IN REAL-TIME.",
  },
  {
    question: "HOW IS CAPITAL DISTRIBUTED?",
    answer:
      "WE UTILIZE THE STRIPE CONNECT PROTOCOL. INTEGRATE YOUR BANK ENDPOINT FOR AUTOMATED SETTLEMENT AFTER EACH SUCCESSFUL TRANSACTION.",
  },
];

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

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
    <div className="bg-black min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-black border-b border-white/10">
          <Container className="py-24 md:py-32">
            <div className="max-w-4xl">
              <span className="text-[10px] font-black text-ink-tertiary uppercase tracking-[0.5em] mb-6 block underline underline-offset-8 decoration-white/20">
                COMMUNICATION / PROTOCOL
              </span>
              <h1 className="text-5xl md:text-8xl font-extrabold text-ink-primary uppercase tracking-tighter leading-[0.85] mb-8">
                INTERFACE WITH US
              </h1>
              <p className="text-xl text-ink-secondary leading-relaxed uppercase tracking-tight max-w-2xl font-medium">
                Direct channel to the founding team. Deploy your inquiries or system feedback.
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-24">
          <div className="grid md:grid-cols-5 gap-20">
            {/* Primary Interface Information */}
            <div className="md:col-span-2 space-y-16">
              <section className="space-y-8">
                <h2 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em] border-b border-white/10 pb-4">
                  Direct Endpoints
                </h2>
                <div className="space-y-4">
                   <a 
                      href="mailto:hello@suburbmates.com.au"
                      className="flex items-center justify-between p-6 bg-ink-surface-1 border border-white/5 hover:border-white/20 transition-all group"
                   >
                      <div className="flex items-center gap-4">
                         <Mail className="w-5 h-5 text-ink-tertiary" />
                         <span className="text-[11px] font-bold text-ink-primary uppercase tracking-widest">hello@suburbmates.com.au</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                   </a>
                </div>
              </section>

              <section className="bg-ink-surface-1 border border-white/5 p-10 space-y-8 shadow-2xl">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-ink-primary" />
                  <h3 className="text-[10px] font-black text-ink-primary uppercase tracking-[0.4em]">Resource Centre</h3>
                </div>
                <p className="text-ink-tertiary text-xs uppercase tracking-widest leading-relaxed">
                  Access our centralized documentation for technical support and platform guidelines.
                </p>
                <Link
                  href="/help"
                  className="inline-block w-full text-center py-4 bg-ink-primary text-black text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
                >
                  ACCESS DOCUMENTATION
                </Link>
              </section>
            </div>

            {/* Transmission Form */}
            <div className="md:col-span-3">
              <div className="bg-ink-surface-1 border border-white/5 p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <span className="text-[8px] font-bold text-ink-tertiary uppercase tracking-widest opacity-30">SECURE CHANNEL PRO-V1.0</span>
                </div>
                <h2 className="text-2xl font-black text-ink-primary uppercase tracking-tighter mb-10">
                  SEND TRANSMISSION
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-ink-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <MessageSquare className="w-8 h-8 text-ink-success" />
                    </div>
                    <h3 className="text-xl font-black text-ink-primary uppercase tracking-[0.3em] mb-4">Transmission Received</h3>
                    <p className="text-ink-tertiary text-[10px] uppercase tracking-widest mb-10 leading-relaxed max-w-sm mx-auto">
                      Thank you for contacting Suburbmates. Our team has received your logs and will respond shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-ink-primary text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-1 hover:border-ink-primary transition-all"
                    >
                      New Transmission
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest ml-1">IDENTIFIER</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="FULL NAME"
                          className="w-full bg-black border border-white/10 px-6 py-4 text-[10px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/10 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest ml-1">ENDPOINT (EMAIL)</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="NAME@DOMAIN.COM"
                          className="w-full bg-black border border-white/10 px-6 py-4 text-[10px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/10 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest ml-1">SUBJECT MATTER</label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="CATEGORY OF INQUIRY"
                        className="w-full bg-black border border-white/10 px-6 py-4 text-[10px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/10 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest ml-1">MESSAGE LOGS</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="SPECIFY YOUR REQUIREMENTS..."
                        className="w-full bg-black border border-white/10 px-6 py-4 text-[10px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/10 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-5 bg-ink-primary text-black text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-opacity disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "TRANSMITTING..." : "SEND TRANSMISSION"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>

        {/* FAQ Section - Clinical Minimalist */}
        <div className="py-32 bg-black border-t border-white/10">
          <Container className="max-w-5xl">
            <h2 className="text-3xl md:text-5xl font-black text-ink-primary uppercase tracking-tighter mb-20 text-center">
              SYSTEM PROTOCOLS (FAQ)
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-ink-surface-1 border border-white/5 p-10 hover:border-white/20 transition-all group"
                >
                  <h3 className="text-[11px] font-black text-ink-primary uppercase tracking-[0.2em] mb-6 leading-relaxed group-hover:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-ink-tertiary text-[10px] leading-relaxed uppercase tracking-widest font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* CTA Section - Final Interface */}
        <div className="bg-ink-primary py-32 text-black">
          <Container className="text-center">
             <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 block opacity-60">NEXT STEPS</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-none">
              READY TO INTEGRATE?
            </h2>
            <p className="text-lg uppercase tracking-widest mb-16 max-w-2xl mx-auto font-bold opacity-80 leading-relaxed">
              Join Melbourne&rsquo;s leading creative directory and showcase your professional assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/regions"
                className="px-12 py-5 bg-black text-white hover:bg-zinc-900 transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
              >
                EXPLORE DIRECTORY
              </Link>
              <Link
                href="/auth/register"
                className="px-12 py-5 border-2 border-black text-black hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]"
              >
                INITIALIZE ACCOUNT
              </Link>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
