## 2025-01-27 - [CRITICAL] HTML Injection in Email Templates
**Vulnerability:** Contact form submissions were interpolating user input directly into HTML email bodies without sanitization. Malicious users could inject arbitrary HTML (e.g., links, tracking pixels) into emails sent to support.
**Learning:** The assumption that transactional email services or the codebase already had a global sanitizer was incorrect. `escapeHtml` was missing entirely from `src/lib/utils.ts`.
**Prevention:** Always sanitize user input before interpolating into HTML strings. Added `escapeHtml` utility and applied it to the contact form. Also added rate limiting to prevent DoS.
