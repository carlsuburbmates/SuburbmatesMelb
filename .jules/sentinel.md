## 2024-05-23 - XSS in HTML Emails
**Vulnerability:** Contact form submissions were interpolating user input (name, email, subject, message) directly into the HTML string passed to the email sending library without any sanitization. This allowed for Cross-Site Scripting (XSS) within the generated email template.
**Learning:** Even internal-facing emails (like contact form submissions sent to support) must sanitize user input. HTML generation via string interpolation is particularly risky. Newlines in the subject could also lead to email header injection.
**Prevention:** Always use `escapeHtml` to sanitize user inputs before placing them into HTML templates. Use `stripNewlines` for inputs that are placed in headers (like `subject`).
