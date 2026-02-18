# Sentinel Journal 🛡️

## 2026-02-18 - Contact Form HTML Injection
**Vulnerability:** Unsanitized user input (`message`, `name`, `subject`) was directly interpolated into HTML email templates in `src/app/api/contact/route.ts`. This allowed potential HTML injection/XSS in support emails.
**Learning:** Even though `sendEmail` uses a service (Resend), the HTML body construction happens in our code. We must sanitize *before* string interpolation.
**Prevention:** Always use `escapeHtml` when embedding user input into HTML strings, even for internal emails.
