## 2025-02-19 - Fixed Contact Form XSS
**Vulnerability:** Contact form inputs (name, email, subject, message) were inserted directly into HTML emails without sanitization, allowing XSS injection.
**Learning:** `sendEmail` function passes HTML directly to Resend without sanitization. Callers must sanitize input. Replacing newlines with `<br>` is not enough.
**Prevention:** Always use `escapeHtml` before inserting user input into HTML templates. Sanitize *before* formatting (like replacing newlines).
