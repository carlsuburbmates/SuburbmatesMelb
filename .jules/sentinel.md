## 2025-03-21 - HTML and CRLF Injection in Email Templates
**Vulnerability:** User-provided inputs (like name, email, subject, message) from contact forms were being directly interpolated into email template HTML and headers without sanitization, leading to potential Cross-Site Scripting (XSS) / HTML injection in the email client and CRLF/Header injection.
**Learning:** Raw input must never be interpolated into HTML or headers, as doing so introduces injection vulnerabilities.
**Prevention:** Always use a custom HTML escaping utility to encode special characters (especially processing '&' first to prevent double encoding) when embedding input in HTML, and strip newlines from inputs intended for email headers (like `subject` and `replyTo`).
