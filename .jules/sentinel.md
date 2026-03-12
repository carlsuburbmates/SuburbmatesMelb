## 2024-05-24 - HTML Injection in Transactional Emails
**Vulnerability:** User inputs (name, email, subject, message) in the contact form endpoint (`/api/contact`) were being directly interpolated into HTML email templates without sanitization, leading to potential HTML/XSS injection when viewed in email clients. Email subjects were also vulnerable to newline header injection.
**Learning:** Even internal-facing transactional emails are vulnerable to injection attacks if user input is not sanitized before interpolation.
**Prevention:** Always use `escapeHtml` to sanitize user inputs *before* formatting operations like replacing newlines in HTML email bodies. Use `stripNewlines` to sanitize email subjects to prevent header injection and avoid double encoding.
