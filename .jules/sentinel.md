## 2024-03-31 - Missing HTML Sanitization in Email Templates
**Vulnerability:** User inputs were passed directly into HTML email templates without escaping, exposing the application to HTML/Script injection attacks and potential phishing.
**Learning:** Even internal support emails require full input sanitization because payloads can execute in the recipient's email client.
**Prevention:** Use a standard `escapeHtml` utility for any user input rendered in HTML contexts, and sanitize email headers to prevent CRLF injection.
