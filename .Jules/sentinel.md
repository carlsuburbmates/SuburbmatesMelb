## 2025-02-21 - Contact Form Vulnerabilities
**Vulnerability:** The contact form endpoint (`/api/contact`) was vulnerable to XSS (unsanitized input in HTML emails) and lacked rate limiting, exposing it to Spam and DoS attacks.
**Learning:** Public API endpoints, especially those triggering emails or database writes, must have explicit rate limiting. HTML email generation requires manual sanitization of all interpolated user input.
**Prevention:** Use `withApiRateLimit` wrapper on all public routes. Use `escapeHtml` (added to `src/lib/utils.ts`) for any content injected into HTML strings.
