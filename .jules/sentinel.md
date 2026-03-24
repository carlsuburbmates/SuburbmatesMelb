## 2024-03-24 - HTML and CRLF Injection Prevention in Email Utilities
**Vulnerability:** Contact forms and general email sending functions were vulnerable to HTML injection (XSS in HTML email templates) and CRLF header injection (in user-provided email subject and replyTo fields).
**Learning:** Raw user input was being directly interpolated into the `html` field of emails and header fields (like `subject`).
**Prevention:** Introduced specific utilities `escapeHtml` (processing ampersands first to avoid double encoding) and `stripNewlines` to sanitize inputs before using them in email headers or bodies. Always sanitize data at the boundary before using it to construct emails.
