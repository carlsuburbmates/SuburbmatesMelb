## 2025-02-26 - [XSS in Email Templating]
**Vulnerability:** User inputs (like `name`, `subject`, `message`) were interpolated directly into HTML email strings in `src/app/api/contact/route.ts` without sanitization, leading to Stored XSS for email recipients.
**Learning:** The project's email logic (`src/lib/email.ts`) accepts raw HTML strings and does *not* automatically sanitize inputs. Callers are responsible for sanitizing data before passing it to `sendEmail`.
**Prevention:** Always use `escapeHtml` (from `src/lib/sanitization.ts`) when embedding user data into email HTML templates. Use `stripNewlines` for headers.
