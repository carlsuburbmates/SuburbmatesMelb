"use client";

import { Building2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function SignupClient() {
  const [formData, setFormData] = useState({ name: "", email: "", businessName: "", isVendor: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const nameParts = formData.name.trim().split(" ");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, first_name: nameParts[0] || "", last_name: nameParts.slice(1).join(" ") || "", user_type: formData.isVendor ? "business_owner" : "customer" }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        toast.success("Magic link sent. Check your inbox.");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%]" style={{ background: "radial-gradient(ellipse 50% 50% at 80% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)" }} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h2 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Create Account</h2>
        <p className="mt-3 text-sm" style={{ color: "var(--text-tertiary)" }}>{formData.isVendor ? "Creator Registration" : "Join SuburbMates"}</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-8 md:p-10 rounded-2xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)", boxShadow: "0 8px 48px rgba(0,0,0,0.3)" }}>
          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <svg className="w-7 h-7" style={{ color: "#22c55e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-display text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Check your inbox</h3>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Redirecting to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-secondary)" }}>Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                  <input id="name" name="name" type="text" required className="w-full h-12 pl-12 pr-4 rounded-xl text-sm focus:outline-none transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="Your name" value={formData.name} onChange={handleInputChange} data-testid="signup-name" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-secondary)" }}>Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                  <input id="email" name="email" type="email" required className="w-full h-12 pl-12 pr-4 rounded-xl text-sm focus:outline-none transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="name@email.com" value={formData.email} onChange={handleInputChange} data-testid="signup-email" />
                </div>
              </div>
              {formData.isVendor && (
                <div>
                  <label htmlFor="businessName" className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-secondary)" }}>Studio name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                    <input id="businessName" name="businessName" type="text" required className="w-full h-12 pl-12 pr-4 rounded-xl text-sm focus:outline-none transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="Your studio name" value={formData.businessName} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-tertiary)" }}>
                We&apos;ll send a magic link to your inbox. No password needed.
              </div>

              {error && (
                <div className="p-4 rounded-xl text-sm text-center" style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>{error}</div>
              )}

              <div className="flex items-center gap-3">
                <input id="isVendor" name="isVendor" type="checkbox" checked={formData.isVendor} onChange={handleInputChange} className="h-4 w-4 rounded-md accent-[#6C5CE7] cursor-pointer" />
                <label htmlFor="isVendor" className="text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>I want to list as a creator</label>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-30" data-testid="signup-submit">
                {isSubmitting ? "Processing..." : formData.isVendor ? "Send Creator Magic Link" : "Send Magic Link"}
              </button>

              <div className="pt-4 text-center" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium" style={{ color: "var(--accent-atmosphere)" }}>Sign in</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
