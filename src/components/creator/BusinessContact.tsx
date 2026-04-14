"use client";

import { useState } from "react";
import { Phone, Mail, Globe, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessContactProps {
  business: MappedBusinessProfile;
}

export function BusinessContact({ business }: BusinessContactProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8" data-testid="business-contact">
      {/* Contact Channels */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold pb-3" style={{ color: "var(--accent-atmosphere)", borderBottom: "1px solid var(--border)" }}>Contact</h3>
        <div className="space-y-2">
          {business.contact.phone && (
            <a href={`tel:${business.contact.phone}`} className="flex items-center justify-between p-3.5 rounded-xl transition-all hover:bg-white/5" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{business.contact.phone}</span>
              </div>
              <ArrowRight className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
            </a>
          )}
          {business.contact.email && (
            <a href={`mailto:${business.contact.email}`} className="flex items-center justify-between p-3.5 rounded-xl transition-all hover:bg-white/5" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                <span className="text-sm font-medium truncate max-w-[180px]" style={{ color: "var(--text-primary)" }}>{business.contact.email}</span>
              </div>
              <ArrowRight className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
            </a>
          )}
          {business.contact.website && (
            <a href={business.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 rounded-xl transition-all hover:bg-white/5" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Website</span>
              </div>
              <ArrowRight className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
            </a>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" style={{ color: "var(--accent-atmosphere)" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--accent-atmosphere)" }}>Send a message</h3>
        </div>
        {!showContactForm ? (
          <div className="p-5 rounded-xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)" }}>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Reach out to {business.name} for inquiries or collaboration.
            </p>
            <button onClick={() => setShowContactForm(true)} className="btn-primary w-full justify-center !text-sm" data-testid="contact-init">
              Contact Studio
            </button>
          </div>
        ) : success ? (
          <div className="p-6 rounded-xl text-center" style={{ background: "var(--bg-surface-1)", border: "1px solid rgba(34, 197, 94, 0.15)" }}>
            <CheckCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "#22c55e" }} />
            <h4 className="font-display text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>Message Sent</h4>
            <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>The studio will respond shortly.</p>
            <button onClick={() => { setSuccess(false); setShowContactForm(true); }} className="text-xs font-medium" style={{ color: "var(--accent-atmosphere)" }}>Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your name" className="w-full h-10 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email" className="w-full h-10 px-4 rounded-xl text-sm focus:outline-none" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={3} placeholder="Your message" className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowContactForm(false)} className="btn-secondary flex-1 !py-2.5 !min-h-0 !text-xs">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-[2] !py-2.5 !min-h-0 !text-xs">{isSubmitting ? "Sending..." : "Send"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
