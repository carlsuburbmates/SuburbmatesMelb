## 2024-05-24 - Unsanitized input in email HTML
**Vulnerability:** Contact form submissions directly interpolate unsanitized user input (`name`, `email`, `subject`, `message`) into an HTML email template in `src/app/api/contact/route.ts`.
**Learning:** This introduces an HTML injection / XSS vulnerability for the recipient viewing the email, which can lead to phishing or exploitation depending on the email client's security.
**Prevention:** Always sanitize user input before embedding it into HTML content, even for emails. Use standard utility functions like `escapeHtml` to neutralize HTML tags.
