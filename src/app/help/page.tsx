"use client";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BookOpen, Mail, MessageSquare, Info, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I create a creator profile?",
      answer:
        "To create a profile, click on 'Sign up' in the header and select 'Creator'. Fill in your details including your studio name and description. We review profiles shortly to ensure community quality.",
    },
    {
      question: "How much does it cost to list my products?",
      answer:
        "Basic listing is completely free! We offer tiered plans for growing creators. You can upgrade or downgrade at any time from your dashboard.",
    },
    {
      question: "How do I sell digital products?",
      answer:
        "Once your profile is active, you can add digital products to your listing. Simply go to your dashboard, click 'Add Product', and upload your digital files. Neighbours can purchase and download them directly from your profile.",
    },
    {
      question: "How do I get paid for my sales?",
      answer:
        "We use Stripe Connect to process payments safely. You'll need to connect your Stripe account to receive payments. Funds are transferred to your bank account automatically after a purchase is completed.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time from your dashboard. Your subscription will remain active until the end of your current billing period.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "You can update your profile and studio information at any time by logging into your dashboard and navigating to 'Settings'. Changes are reflected immediately on your public profile.",
    },
    {
      question: "What exactly is SuburbMates?",
      answer:
        "SuburbMates is a creator portfolio platform and discovery directory. We provide the tools for you to host a professional page and sell products, but we are not a marketing agency. We don't guarantee traffic or sales; we give you the best possible home to send your existing audience to.",
    },
  ];

  const supportOptions = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Quick guides and tutorials",
      action: "Read Docs",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from the founder",
      action: "Email Us",
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Message sent successfully!");
      setIsContactModalOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ink-base min-h-screen">
      <Header />
      <main>
        {/* Clinical Header Section */}
        <section className="bg-ink-surface-1 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
          <Container className="py-24 sm:py-32 relative z-10">
            <div className="max-w-4xl">
              <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.5em] mb-4 block">
                Support Protocol
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-ink-primary tracking-tighter uppercase leading-none mb-8">
                Help Centre
              </h1>
              <p className="text-xl text-ink-secondary leading-relaxed tracking-tight max-w-2xl font-medium">
                Find answers to common questions or establish direct contact with the founders.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Tactical Navigation */}
              <aside className="lg:col-span-3">
                <nav className="flex flex-col space-y-1" aria-label="Tabs">
                  {[
                    { id: "faq", label: "FAQ Database", icon: Info },
                    { id: "support", label: "Support Nodes", icon: BookOpen },
                    { id: "contact", label: "Transmission", icon: Mail },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`group flex items-center justify-between px-4 py-3 text-left rounded-sm transition-all border text-[10px] font-bold uppercase tracking-widest ${
                          activeTab === item.id
                            ? "bg-white/10 text-ink-primary border-white/10"
                            : "text-ink-tertiary border-transparent hover:text-ink-primary hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </div>
                        {activeTab === item.id && <ArrowUpRight className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* High-Precision Content Surface */}
              <div className="lg:col-span-9">
                <div className="bg-ink-surface-1 border border-white/5 p-8 sm:p-12 min-h-[600px] rounded-sm shadow-2xl">
                  {activeTab === "faq" && (
                    <div className="space-y-12">
                      <div className="border-b border-white/5 pb-8">
                        <h2 className="text-xs font-bold text-ink-primary uppercase tracking-[0.3em]">
                          Frequently Asked Questions
                        </h2>
                      </div>
                      <div className="grid gap-10">
                        {faqs.map((faq, index) => (
                          <div key={index} className="group">
                            <h3 className="text-sm font-bold text-ink-primary mb-3 uppercase tracking-widest flex items-center gap-3">
                              <span className="text-ink-tertiary font-mono opacity-50">0{index + 1}/</span>
                              {faq.question}
                            </h3>
                            <p className="text-sm text-ink-secondary leading-relaxed font-medium pl-10 border-l border-white/5 ml-4">
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "support" && (
                    <div className="space-y-12">
                      <div className="border-b border-white/5 pb-8">
                        <h2 className="text-xs font-bold text-ink-primary uppercase tracking-[0.3em]">
                          Support Options
                        </h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {supportOptions.map((option, index) => {
                          const Icon = option.icon;
                          return (
                            <div
                              key={index}
                              className="border border-white/5 bg-ink-surface-2 p-8 rounded-sm hover:border-white/20 transition-all group"
                            >
                              <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                                <Icon className="w-5 h-5 text-ink-primary" />
                              </div>
                              <h3 className="text-sm font-bold text-ink-primary uppercase tracking-widest mb-2">
                                {option.title}
                              </h3>
                              <p className="text-xs text-ink-secondary mb-8 font-medium leading-relaxed">
                                {option.description}
                              </p>
                              <Button
                                onClick={() => {
                                  if (option.title === "Email Support") {
                                    window.location.href = "mailto:hello@suburbmates.com.au";
                                  }
                                }}
                                className="w-full bg-white text-ink-base hover:bg-white/90 text-[10px] font-bold uppercase tracking-widest h-12"
                              >
                                {option.action}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === "contact" && (
                    <div className="space-y-12">
                      <div className="border-b border-white/5 pb-8">
                        <h2 className="text-xs font-bold text-ink-primary uppercase tracking-[0.3em]">
                          Establish Contact
                        </h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-8">
                          {[
                            { icon: Mail, label: "Email", value: "hello@suburbmates.com.au" },
                            { icon: MessageSquare, label: "Business Hours", value: "Mon - Fri: 9am - 5pm AEST" },
                          ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                              <div key={i} className="flex items-start gap-4 p-6 bg-ink-surface-2 border border-white/5 rounded-sm">
                                <Icon className="w-5 h-5 text-ink-secondary mt-1" />
                                <div>
                                  <p className="text-[10px] font-bold text-ink-primary uppercase tracking-widest mb-1">{item.label}</p>
                                  <p className="text-sm text-ink-secondary font-medium">{item.value}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="bg-ink-surface-2 border border-white/5 p-8 rounded-sm text-center">
                          <h3 className="text-xs font-bold text-ink-primary uppercase tracking-widest mb-4">Direct Message</h3>
                          <p className="text-xs text-ink-secondary mb-8 font-medium leading-relaxed">
                            Need a faster response? Start a formal transmission to our founders.
                          </p>
                          <Button
                            onClick={() => setIsContactModalOpen(true)}
                            className="bg-white text-ink-base hover:bg-white/90 px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm"
                          >
                            Send Transmission
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Global Footer CTA */}
        <section className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
          <div className="container-custom relative z-10 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-ink-primary mb-8 uppercase tracking-tighter leading-none">
              Still Need Analysis?
            </h2>
            <p className="text-lg text-ink-secondary mb-12 max-w-xl mx-auto font-medium tracking-tight">
              Our support protocols are designed for maximum clarity. If the database failed your query, we are available.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => (window.location.href = "mailto:hello@suburbmates.com.au")}
                className="bg-white text-ink-base hover:bg-white/90 px-10 py-6 text-[10px] font-bold uppercase tracking-widest"
              >
                Direct Email
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/regions")}
                className="border-white/20 text-ink-primary hover:bg-white/5 px-10 py-6 text-[10px] font-bold uppercase tracking-widest"
              >
                Access Directory
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="START TRANSMISSION"
      >
        <div className="bg-ink-base p-2">
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] font-bold text-ink-secondary uppercase tracking-[0.2em] ml-1">
                  Identity
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="NAME"
                  className="w-full px-4 py-3 bg-ink-surface-1 border border-white/10 rounded-sm text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-white/30 transition-all font-medium uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-bold text-ink-secondary uppercase tracking-[0.2em] ml-1">
                  Electronic Mail
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="EMAIL"
                  className="w-full px-4 py-3 bg-ink-surface-1 border border-white/10 rounded-sm text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-white/30 transition-all font-medium uppercase"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-[10px] font-bold text-ink-secondary uppercase tracking-[0.2em] ml-1">
                Objective
              </label>
              <input
                type="text"
                id="subject"
                required
                placeholder="SUBJECT"
                className="w-full px-4 py-3 bg-ink-surface-1 border border-white/10 rounded-sm text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-white/30 transition-all font-medium uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-[10px] font-bold text-ink-secondary uppercase tracking-[0.2em] ml-1">
                Data Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                placeholder="MESSAGE CONTENT"
                className="w-full px-4 py-3 bg-ink-surface-1 border border-white/10 rounded-sm text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-white/30 transition-all font-medium min-h-[120px] uppercase"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white text-ink-base hover:bg-white/90 text-[10px] font-bold uppercase tracking-[0.3em] h-14" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "INITIALIZING..." : "EXECUTE TRANSMISSION"}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
