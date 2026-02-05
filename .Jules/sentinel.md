## 2025-02-05 - Missing Email Sanitization
**Vulnerability:** Contact form allowed Stored XSS because user input was directly interpolated into HTML emails.
**Learning:** The `sendEmail` utility and most email templates in `src/lib/email.ts` do not perform automatic sanitization. They rely on the caller or the template construction to be safe.
**Prevention:** Always use `escapeHtml` (added to `src/lib/utils.ts`) when interpolating user-generated content into HTML strings, especially for emails.
