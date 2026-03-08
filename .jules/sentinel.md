## 2024-05-24 - HTML Email XSS in Contact Form
**Vulnerability:** User input from the contact form was directly interpolated into an HTML email template (`src/app/api/contact/route.ts`) without prior sanitization, leading to a Cross-Site Scripting (XSS) vulnerability when the email is viewed.
**Learning:** HTML Email Sanitization: User input must be sanitized using `escapeHtml` *before* formatting operations like replacing newlines. Email subjects (in the email header) must not be sanitized with `escapeHtml` to avoid double encoding; use `stripNewlines` instead.
**Prevention:** Always sanitize any untrusted input with a robust HTML escaping utility before incorporating it into HTML structures, including email bodies.
