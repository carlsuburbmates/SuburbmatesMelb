## 2024-03-20 - HTML Injection in Contact Form
**Vulnerability:** The `/api/contact` route was vulnerable to HTML injection. User-submitted fields (`name`, `email`, `subject`, `message`) were directly interpolated into the HTML body of support emails without sanitization. An attacker could execute arbitrary HTML or break the email layout.
**Learning:** `sendEmail` does not auto-sanitize inputs. When building HTML strings for emails, user inputs must be manually escaped *before* any other string manipulation (like replacing newlines). Email subjects used in headers should have newlines stripped but not be HTML escaped to prevent double-encoding.
**Prevention:** Always use `escapeHtml` for values placed within HTML body templates, and `stripNewlines` for values placed in headers.
