## 2026-01-21 - Fixed Stored XSS in Contact Form
**Vulnerability:** Stored XSS in `src/app/api/contact/route.ts`. User inputs (`name`, `subject`, `message`) were interpolated directly into the email HTML body without sanitization.
**Learning:** Even internal emails can be XSS vectors if the email client renders HTML.
**Prevention:** Always sanitize user input before putting it into an HTML string, even for emails. Added `escapeHtml` utility.
