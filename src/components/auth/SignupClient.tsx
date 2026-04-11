"use client";

import { Building2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-hot-toast';

export function SignupClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    isVendor: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsSubmitting(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: firstName,
          last_name: lastName,
          user_type: formData.isVendor ? 'business_owner' : 'customer',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        toast.success('Magic link sent. Check your inbox.');

        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-ink-base flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow — depth matching design system */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[600px] h-[600px] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-ink-primary uppercase tracking-[0.3em] leading-none mb-4">
            Identity Registration
          </h2>
          <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.5em]">
            {formData.isVendor
              ? "Creator Registration"
              : "Community Entry Protocol"}
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-ink-surface-1 border border-white/5 py-10 px-6 md:px-10 shadow-2xl rounded-sm">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border border-green-500/30 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-ink-primary uppercase tracking-widest mb-2">
                Authentication Confirmed
              </h3>
              <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Redirecting to Secure Access...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.3em] mb-3 ml-1"
                  >
                    Full Identity (Name)
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary group-focus-within:text-ink-primary transition-colors" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full h-14 pl-12 pr-4 bg-ink-base border border-white/10 focus:border-white/30 text-ink-primary text-sm transition-all focus:outline-none placeholder:text-ink-tertiary/30"
                      placeholder="ENTER FULL NAME"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.3em] mb-3 ml-1"
                  >
                    Communication Link (Email)
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary group-focus-within:text-ink-primary transition-colors" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full h-14 pl-12 pr-4 bg-ink-base border border-white/10 focus:border-white/30 text-ink-primary text-sm transition-all focus:outline-none placeholder:text-ink-tertiary/30"
                      placeholder="NAME@DOMAIN.COM"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {formData.isVendor && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label
                      htmlFor="businessName"
                      className="block text-[10px] font-bold text-ink-tertiary uppercase tracking-[0.3em] mb-3 ml-1"
                    >
                      Organization Nomenclature
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary group-focus-within:text-ink-primary transition-colors" />
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required
                        className="block w-full h-14 pl-12 pr-4 bg-ink-base border border-white/10 focus:border-white/30 text-ink-primary text-sm transition-all focus:outline-none placeholder:text-ink-tertiary/30"
                        placeholder="ENTITY NAME"
                        value={formData.businessName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="border border-white/10 bg-white/5 px-4 py-4 rounded-sm">
                  <p className="text-[10px] font-bold text-ink-secondary uppercase tracking-[0.3em] mb-2">
                    Passwordless Access
                  </p>
                  <p className="text-xs text-ink-tertiary leading-relaxed">
                    Signup sends a magic link to your inbox. Google sign-in is also supported from the login screen after your account is created.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/10 border border-red-900/30 rounded-sm p-4 animate-in fade-in slide-in-from-top-1">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest text-center">{error}</p>
                </div>
              )}

              <div className="flex items-center gap-3 px-1">
                <div className="relative flex items-center">
                  <input
                    id="isVendor"
                    name="isVendor"
                    type="checkbox"
                    checked={formData.isVendor}
                    onChange={handleInputChange}
                    className="h-4 w-4 appearance-none border border-white/20 bg-ink-base checked:bg-white checked:border-white transition-all cursor-pointer rounded-sm"
                  />
                  {formData.isVendor && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="isVendor"
                  className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest cursor-pointer hover:text-ink-primary transition-colors"
                >
                  List as a Creator (Showcase Digital Products)
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 bg-white text-black uppercase font-bold tracking-[0.5em] text-[10px] hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-4">
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></span>
                      PROCESSING
                    </span>
                  ) : formData.isVendor ? (
                    "Send Creator Magic Link"
                  ) : (
                    "Send Magic Link"
                  )}
                </button>
              </div>

              <div className="pt-4 text-center border-t border-white/5">
                <p className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">
                  Existing Identity?{" "}
                  <Link
                    href="/auth/login"
                    className="text-ink-primary hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
                  >
                    Residency Log In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
