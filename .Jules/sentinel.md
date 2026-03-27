## 2026-02-25 - [Email Injection Vulnerability]
**Vulnerability:** Contact form allowed unsanitized HTML in emails, leading to Stored XSS if viewed in webmail, and potential header injection via newlines in subject.
**Learning:** `sendEmail` function in `src/lib/email.ts` takes raw HTML and subject without sanitization. Callers must sanitize inputs.
**Prevention:** Created `src/lib/sanitization.ts` with `escapeHtml` and `stripNewlines`. Updated contact API to use them.
