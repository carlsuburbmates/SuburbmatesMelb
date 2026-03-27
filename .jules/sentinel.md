## 2024-05-24 - [Contact Form XSS Vulnerability]
**Vulnerability:** Contact form submissions are vulnerable to XSS because user inputs are directly interpolated into the HTML email body without sanitization.
**Learning:** Even internal emails need input sanitization to prevent XSS.
**Prevention:** Always sanitize user input before embedding it in HTML, using a utility function like `escapeHtml`.
