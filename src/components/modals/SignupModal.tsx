"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { User, Store, ArrowRight, Mail } from "lucide-react";
import { analytics } from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = "customer" | "business_owner" | null;

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithOtpAs, signInWithGoogle } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    analytics.signupRoleSelect(role ?? "customer");
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch {
      toast.error("Authentication failed. Retry.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const role = selectedRole === "business_owner" ? "business_owner" : "customer";
      const { error } = await signInWithOtpAs(email, role);
      if (error) throw error;

      toast.success("Magic link sent! Check your inbox.");
      analytics.signupComplete(role);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRole(null);
    setEmail("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        selectedRole
          ? selectedRole === "business_owner"
            ? "Create Profile"
            : "Join SuburbMates"
          : "Join SuburbMates"
      }
      className="max-w-lg"
    >
      {!selectedRole ? (
        <div className="space-y-4">
          <p
            className="text-center mb-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            How would you like to use SuburbMates?
          </p>

          <div className="grid gap-3">
            <button
              onClick={() => handleRoleSelect("customer")}
              className="flex items-center p-5 rounded-xl transition-all text-left group"
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border)",
              }}
              data-testid="signup-role-customer"
            >
              <div
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center mr-4 rounded-xl transition-all"
                style={{
                  background: "var(--accent-atmosphere-muted)",
                  border: "1px solid rgba(108, 92, 231, 0.12)",
                }}
              >
                <User className="w-5 h-5" style={{ color: "var(--accent-atmosphere)" }} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  Customer
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  Explore and find creators.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: "var(--text-tertiary)" }} />
            </button>

            <button
              onClick={() => handleRoleSelect("business_owner")}
              className="flex items-center p-5 rounded-xl transition-all text-left group"
              style={{
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border)",
              }}
              data-testid="signup-role-creator"
            >
              <div
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center mr-4 rounded-xl transition-all"
                style={{
                  background: "var(--accent-cta-muted)",
                  border: "1px solid rgba(249, 115, 22, 0.12)",
                }}
              >
                <Store className="w-5 h-5" style={{ color: "var(--accent-cta)" }} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  Creator
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  Showcase your work and get leads.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: "var(--text-tertiary)" }} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border-active)",
              color: "var(--text-primary)",
            }}
            data-testid="signup-google"
          >
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: "1px solid var(--border)" }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4" style={{ background: "var(--bg-surface-1)", color: "var(--text-tertiary)" }}>
                or use email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-2.5" style={{ color: "var(--text-secondary)" }}>
                Enter your email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl text-sm focus:outline-none transition-all"
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="signup-email-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="signup-submit"
            >
              {isLoading ? "Sending..." : "Send Magic Link"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="w-full text-xs font-medium text-center pb-1 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
            >
              &larr; Back to selection
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
}
