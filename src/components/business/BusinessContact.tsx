'use client';

import { useState } from 'react';
import { Phone, Mail, Globe, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  suburb: string;
}

interface BusinessContactProps {
  business: Business;
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
    
    // TODO: Implement contact form submission
    // This would send an email to the business owner
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setSuccess(false);
    // Keep form open so user can send another message
    setShowContactForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Contact Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="space-y-4">
          {/* Phone */}
          {business.phone && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <a 
                  href={`tel:${business.phone}`}
                  className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                >
                  {business.phone}
                </a>
              </div>
            </div>
          )}

          {/* Email */}
          {business.email && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <a 
                  href={`mailto:${business.email}`}
                  className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                >
                  {business.email}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {business.website && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Website</p>
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}

          {/* Address */}
          {business.address && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900 font-medium">{business.address}</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Send a Message</h3>
        </div>

        {!showContactForm ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Get in touch with {business.name} directly through our contact form.
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="btn-primary w-full"
            >
              Contact Business
            </button>
          </div>
        ) : success ? (
          <div
            className="text-center py-8 animate-in fade-in duration-300"
            role="status"
            aria-live="polite"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h4>
            <p className="text-gray-600 mb-6">
              Thanks for reaching out. {business.name} will get back to you shortly.
            </p>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-end">
               <span className="text-xs text-gray-500" aria-hidden="true">* Required fields</span>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-required="true"
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-required="true"
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0400 000 000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                aria-required="true"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none placeholder:text-gray-400"
                placeholder="Hi, I'm interested in..."
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary inline-flex items-center justify-center min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Send Message</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Your message will be sent directly to {business.name}. 
            They typically respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
