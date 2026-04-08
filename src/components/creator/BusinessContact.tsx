'use client';

import { useState } from 'react';
import { Phone, Mail, Globe, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { MappedBusinessProfile } from "@/lib/types";

interface BusinessContactProps {
  business: MappedBusinessProfile;
}

export function BusinessContact({ business }: BusinessContactProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setSuccess(false);
    setShowContactForm(true);
  };

  return (
    <div className="space-y-12">
      {/* Contact Channels */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-ink-primary uppercase tracking-widest border-b border-white/10 pb-4">
          Direct Channels
        </h3>
        
        <div className="space-y-2">
          {business.contact.phone && (
            <a 
              href={`tel:${business.contact.phone}`}
              className="flex items-center justify-between p-4 bg-ink-surface-1 border border-white/5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-ink-tertiary" />
                <span className="text-[11px] font-bold text-ink-primary uppercase tracking-widest">{business.contact.phone}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}

          {business.contact.email && (
            <a 
              href={`mailto:${business.contact.email}`}
              className="flex items-center justify-between p-4 bg-ink-surface-1 border border-white/5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-ink-tertiary" />
                <span className="text-[11px] font-bold text-ink-primary uppercase tracking-widest leading-none truncate max-w-[200px]">{business.contact.email}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}

          {business.contact.website && (
            <a 
              href={business.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-ink-surface-1 border border-white/5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <Globe className="w-4 h-4 text-ink-tertiary" />
                <span className="text-[11px] font-bold text-ink-primary uppercase tracking-widest">Digital HQ</span>
              </div>
              <ArrowRight className="w-3 h-3 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
        </div>
      </div>

      {/* Inquiry Protocol */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-ink-primary" />
          <h3 className="text-[11px] font-black text-ink-primary uppercase tracking-widest">Inquiry Protocol</h3>
        </div>

        {!showContactForm ? (
          <div className="bg-ink-surface-1 border border-white/5 p-6 space-y-6">
            <p className="text-ink-secondary text-xs leading-relaxed uppercase tracking-wide">
              Interface directly with {business.name} for project inquiries or collaboration requests.
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full py-4 bg-ink-primary text-black text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Initialize Contact
            </button>
          </div>
        ) : success ? (
          <div
            className="bg-ink-surface-1 border border-ink-success/20 p-8 text-center animate-in fade-in zoom-in-95 duration-500"
            role="status"
          >
            <div className="w-12 h-12 bg-ink-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-6 h-6 text-ink-success" />
            </div>
            <h4 className="text-[11px] font-black text-ink-primary uppercase tracking-widest mb-3">Transmission Successful</h4>
            <p className="text-ink-secondary text-[11px] uppercase tracking-widest mb-8 leading-relaxed">
              Your message has been processed. The studio will respond within their standard timeframe.
            </p>
            <button
              onClick={handleReset}
              className="text-ink-primary text-[11px] font-black uppercase tracking-widest border-b border-white/10 pb-1"
            >
              New Transmission
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="IDENTIFIER (NAME)"
                  className="w-full bg-black border border-white/10 px-4 py-4 text-[11px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/20 transition-colors"
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="COMMUNICATION ENDPOINT (EMAIL)"
                  className="w-full bg-black border border-white/10 px-4 py-4 text-[11px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/20 transition-colors"
                />
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="BRIEF / MESSAGE"
                  className="w-full bg-black border border-white/10 px-4 py-4 text-[11px] font-bold text-ink-primary uppercase tracking-widest focus:outline-none focus:border-white placeholder:text-white/20 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="flex-1 py-4 border border-white/10 text-ink-tertiary text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-4 bg-ink-primary text-black text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
