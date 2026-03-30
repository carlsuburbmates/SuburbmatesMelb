## 2024-03-30 - Prevent HTML and Header Injection in Emails
**Vulnerability:** Contact form inputs (name, subject, message) were interpolated directly into the HTML body and headers of an email via Resend, leading to possible HTML injection (XSS in email clients) and Email Header Injection (CRLF).
**Learning:** Using standard `replace` routines for simple fixes often misses edge cases or double-escapes. A consistent `escapeHtml` (processing `&` first) and `stripNewlines` should be the standard practice for any text sent out via email APIs.
**Prevention:** All user inputs formatted into HTML string templates must be sanitized via `escapeHtml`. Any user input forming an email header (like `subject`, `replyTo`) must be sanitized via `stripNewlines`.
