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
  { Icon: Twitter, label: "X / Twitter", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
];

export function Footer() {
  return (
    <footer
      data-testid="footer"
      className="pt-24 pb-12 relative overflow-hidden"
      style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}
    >
      {/* Atmospheric bloom */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 100%, var(--accent-atmosphere-soft) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 overflow-hidden flex-shrink-0 rounded-lg"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
              >
                <Image
                  src="/icon.png"
                  alt="SM"
                  width={32}
                  height={32}
                  className="object-cover brightness-200"
                />
              </div>
              <span
                className="font-display text-sm font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Suburbmates
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.6,
                maxWidth: "28ch",
                marginBottom: "1.25rem",
              }}
            >
              Discovery-first platform for Melbourne&rsquo;s digital creators and studios.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:bg-white/5"
                  style={{ color: "var(--text-tertiary)", border: "1px solid var(--border)" }}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="mb-5 text-xs font-semibold tracking-wide"
              style={{ color: "var(--text-tertiary)" }}
            >
              Navigation
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-ink-primary"
                    style={{ color: "var(--text-secondary)" }}
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
              className="mb-5 text-xs font-semibold tracking-wide"
              style={{ color: "var(--text-tertiary)" }}
            >
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-ink-primary"
                    style={{ color: "var(--text-secondary)" }}
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
              className="mb-5 text-xs font-semibold tracking-wide"
              style={{ color: "var(--text-tertiary)" }}
            >
              Direct
            </p>
            <a
              href="mailto:hello@suburbmates.com.au"
              className="text-sm transition-colors hover:text-ink-primary"
              style={{ color: "var(--text-secondary)" }}
            >
              hello@suburbmates.com.au
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            &copy; 2026 Suburbmates. Melbourne, VIC.
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Local Signal Verified.
          </span>
        </div>
      </div>
    </footer>
  );
}
