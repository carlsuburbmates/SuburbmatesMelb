## 2026-02-08 - Unsanitized Email Templates
**Vulnerability:** Email templates in `src/lib/email.ts` and `src/app/api/contact/route.ts` were interpolating user-controlled strings directly into HTML email bodies, creating a stored/reflected XSS vulnerability in email clients.
**Learning:** The `sendEmail` function accepts raw HTML strings, delegating sanitization responsibility to the caller. This pattern is prone to oversight.
**Prevention:**
1. Added `escapeHtml` utility to `src/lib/utils.ts`.
2. Applied `escapeHtml` to all interpolated variables in email templates.
3. Future: Consider using a type-safe email builder or template engine that handles escaping automatically.
