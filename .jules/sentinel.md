
## 2024-03-22 - XSS and Email Header Injection in Email Templates
**Vulnerability:** Unsanitized user inputs (`name`, `email`, `subject`, `message`) were interpolated directly into HTML email bodies in `src/app/api/contact/route.ts`, creating a Cross-Site Scripting (XSS) risk for support staff viewing emails in HTML clients. Additionally, the `subject` and `replyTo` fields lacked newline sanitization, making them vulnerable to Email Header Injection / CRLF injection.
**Learning:** Sending HTML emails requires identical input sanitization as rendering HTML on a web page. Interpolated user data must be escaped (`escapeHtml`). Furthermore, user inputs used in email headers (like Subject or Reply-To) must be stripped of newlines (`stripNewlines`) to prevent bad actors from injecting arbitrary email headers.
**Prevention:** Always use a dedicated sanitization utility (e.g. `src/lib/html-sanitizer.ts`) when passing user-provided data into email templates or email header configuration.
