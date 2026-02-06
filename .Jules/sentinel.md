## 2025-02-06 - Unsanitized Email Templates
**Vulnerability:** Contact form inputs (name, email, message) were interpolated directly into HTML email bodies without sanitization, allowing XSS.
**Learning:** The `sendEmail` helper (wrapping Resend) accepts raw HTML strings and does not perform any sanitization. Any user input injected into email templates must be manually escaped.
**Prevention:** Use the `escapeHtml` utility from `@/lib/utils` for all user-generated content in email templates.
