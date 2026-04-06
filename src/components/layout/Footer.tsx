import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const NAV_LINKS = [
  { label: "Directory", href: "/regions" },
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

const SOCIAL = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Twitter,   label: "X / Twitter", href: "#" },
  { Icon: Linkedin,  label: "LinkedIn",   href: "#" },
];

export function Footer() {
  return (
    <footer className="pt-24 pb-12 bg-ink-base border-t border-white/5 relative overflow-hidden transition-colors selection:bg-white selection:text-black">
      {/* Subtle ambient depth matching pages */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
        }}
      />
      <div className="container-custom relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand col — spans full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 overflow-hidden flex-shrink-0"
                style={{ background: "var(--text-primary)", borderRadius: "2px" }}
              >
                <Image
                  src="/icon.png"
                  alt="SM"
                  width={32}
                  height={32}
                  className="object-cover"
                  style={{ filter: "invert(1)" }}
                />
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                }}
              >
                Suburbmates
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.6,
                maxWidth: "28ch",
                marginBottom: "1rem",
              }}
            >
              Discovery-first directory for Melbourne&rsquo;s digital creators and studios.
            </p>
            {/* Social — icons only on mobile */}
            <div className="flex items-center gap-4">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="transition-opacity hover:opacity-60"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="mb-4"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:opacity-80"
                    style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p
              className="mb-4"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:opacity-80"
                    style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="mb-4"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              Direct
            </p>
            <a
              href="mailto:hello@suburbmates.com.au"
              className="transition-opacity hover:opacity-70"
              style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}
            >
              hello@suburbmates.com.au
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-tertiary)",
            }}
          >
            © 2026 Suburbmates. Melbourne, VIC.
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-tertiary)",
            }}
          >
            Local Signal Verified.
          </span>
        </div>
      </div>
    </footer>
  );
}
