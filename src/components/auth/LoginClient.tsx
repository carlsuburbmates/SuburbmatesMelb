"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export function LoginClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithOtp, signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch {
      toast.error("Google login failed.");
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signInWithOtp(email);
      if (error) throw error;
      toast.success("Magic link sent! Check your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[50%]" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 20%, var(--accent-atmosphere-soft) 0%, transparent 65%)" }} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center font-display text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Sign In</h2>
        <p className="mt-3 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>Welcome back to SuburbMates</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-8 md:p-10 rounded-2xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--glass-border)", boxShadow: "0 8px 48px rgba(0,0,0,0.3)" }}>
          <div className="space-y-6">
            <button onClick={handleGoogleLogin} className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-sm font-medium transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-active)", color: "var(--text-primary)" }} data-testid="login-google">
              Continue with Google
              <ArrowRight className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: "1px solid var(--border)" }} /></div>
              <div className="relative flex justify-center text-xs"><span className="px-4" style={{ background: "var(--bg-surface-1)", color: "var(--text-tertiary)" }}>or use email</span></div>
            </div>

            <form onSubmit={handleMagicLinkLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-secondary)" }}>Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-xl text-sm focus:outline-none transition-all" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="name@email.com" data-testid="login-email" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center disabled:opacity-30" data-testid="login-submit">
                {isLoading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>

            <div className="pt-6 text-center" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                New here?{" "}
                <Link href="/auth/signup" className="font-medium transition-colors" style={{ color: "var(--accent-atmosphere)" }}>Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
