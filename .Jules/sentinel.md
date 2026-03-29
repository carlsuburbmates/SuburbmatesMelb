## 2024-05-22 - HTML Injection in Email Templates
**Vulnerability:** Contact form inputs (`name`, `email`, `subject`, `message`) were interpolated directly into HTML email strings without sanitization.
**Learning:** Developers assumed that email clients would handle sanitization or that Zod validation was sufficient. Zod validates type/format but not content safety.
**Prevention:** Always use an `escapeHtml` utility when constructing HTML strings from user input. Implement it in `src/lib/utils.ts` and use it for all dynamic content in emails.
