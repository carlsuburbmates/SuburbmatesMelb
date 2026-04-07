## 2024-04-07 - Add HTML sanitizer
**Vulnerability:** Email templates in `src/lib/email.ts` inject user-provided data directly into HTML strings without sanitization. This is a vector for Cross-Site Scripting (XSS) or HTML injection if user input contains unescaped HTML tags. In particular, the memory rule mentions "The standard sanitization utility functions escapeHtml and stripNewlines are exported from src/lib/html-sanitizer.ts and should be used to prevent HTML injection and escaping issues, especially in contexts like email templates." but this file doesn't exist.
**Learning:** Even internal email templating needs strict input sanitization.
**Prevention:** Always sanitize inputs before interpolation in HTML templates.
