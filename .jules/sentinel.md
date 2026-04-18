## 2024-05-30 - Fix HTML Injection in Contact Form Emails
**Vulnerability:** User inputs (name, email, subject, message) were interpolated directly into the HTML body of contact form emails without sanitization, leading to potential HTML/Script injection in the emails received by support.
**Learning:** The base `sendEmail` utility sanitizes headers but not HTML bodies. Callers must manually sanitize user inputs before passing them into HTML templates.
**Prevention:** Always use `escapeHtml` (e.g., from `src/lib/html-sanitizer.ts`) to sanitize all user-provided data before embedding it into email HTML bodies or any other HTML templates.
