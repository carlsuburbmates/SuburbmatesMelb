## 2024-03-20 - [High] Prevent HTML and Email Header Injection in Contact Form
**Vulnerability:** Contact form variables (name, email, subject, message) were directly interpolated into an HTML email template and envelope fields (replyTo, subject) without sanitization, leading to XSS and Email Header Injection risks.
**Learning:** Always treat user-submitted form data as untrusted, especially when forwarded via email APIs. The lack of standard sanitization utility usage in `/api/contact/route.ts` exposed the platform to abuse.
**Prevention:** Use `escapeHtml` for any user input rendered in an HTML email body and `stripNewlines` for user input passed into email headers (e.g. subject, replyTo) to prevent CRLF injection.
