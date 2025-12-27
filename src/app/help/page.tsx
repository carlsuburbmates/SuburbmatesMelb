"use client";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BookOpen, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I create a business profile?",
      answer:
        "To create a business profile, click on &lsquo;Sign up&rsquo; in the header and select &lsquo;Business/Vendor&rsquo;. Fill in your business details, including your ABN, business address, and description. Once submitted, our team will review your profile within 24-48 hours.",
    },
    {
      question: "How much does it cost to list my business?",
      answer:
        "Basic listing is completely free! We offer three tiers: Basic (3 products, free), Standard (10 products, $29/month), and Premium (50 products, $99/month). You can upgrade or downgrade at any time.",
    },
    {
      question: "How do I sell digital products?",
      answer:
        "Once your business is verified, you can add digital products to your marketplace listing. Simply go to your dashboard, click &lsquo;Add Product&rsquo;, and upload your digital files. Customers can purchase and download them directly from your profile.",
    },
    {
      question: "How do I get paid for my sales?",
      answer:
        "We use Stripe Connect to process payments. You&rsquo;ll need to connect your Stripe account to receive payments. Funds are transferred directly to your bank account within 2-7 business days after a purchase is completed.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time from your dashboard. Your subscription will remain active until the end of your current billing period. When downgrading, your oldest products will be unpublished first (FIFO).",
    },
    {
      question: "How do I update my business information?",
      answer:
        "You can update your business information at any time by logging into your dashboard and navigating to &lsquo;Business Settings&rsquo;. Changes are reflected immediately on your public profile.",
    },
  ];

  const supportOptions = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      action: "Read Docs",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions",
      action: "Email Us",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call our business hours",
      action: "Call Us",
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
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

      // Success
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
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <Container className="py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Help Centre
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Find answers to common questions or get in touch with our
                support team
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "faq"
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Frequently Asked Questions
                  </button>
                  <button
                    onClick={() => setActiveTab("support")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "support"
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Support Options
                  </button>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "contact"
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Contact Us
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "faq" && (
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "support" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {supportOptions.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {option.title}
                              </h3>
                              <p className="text-gray-600">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              if (option.title === "Email Support") {
                                window.location.href =
                                  "mailto:hello@suburbmates.com.au";
                              } else if (option.title === "Phone Support") {
                                window.location.href = "tel:+61312345678";
                              } else if (option.title === "Live Chat") {
                                setIsContactModalOpen(true);
                              }
                            }}
                            className="w-full"
                          >
                            {option.action}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Get in Touch
                      </h2>
                      <p className="text-gray-600">
                        Can&rsquo;t find what you&rsquo;re looking for? We&rsquo;re here to help!
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-6 h-6 text-gray-900" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <p className="text-gray-600">
                            hello@suburbmates.com.au
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Phone className="w-6 h-6 text-gray-900" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <p className="text-gray-600">+61 3 1234 5678</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-gray-900" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Business Hours
                          </p>
                          <p className="text-gray-600">
                            Monday - Friday: 9am - 5pm AEST
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-8">
                      <Button
                        onClick={() => setIsContactModalOpen(true)}
                        size="lg"
                      >
                        Send us a message
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>

        <div className="bg-gray-900 text-white py-16">
          <Container className="text-center">
            <h2 className="text-3xl font-bold mb-6">Still need help?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions or
              issues you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => setIsContactModalOpen(true)}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/directory")}
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Browse Businesses
              </Button>
            </div>
          </Container>
        </div>
      </main>
      <Footer />

      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Contact Support"
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
