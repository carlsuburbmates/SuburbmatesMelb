## 2024-03-27 - Added input sanitization to prevent XSS and CRLF injection
**Vulnerability:** The `/api/contact` route was reflecting untrusted user input directly into an HTML email body (XSS risk) and passing unsanitized input into email headers (CRLF/Email Header Injection risk).
**Learning:** `sendEmail` utility does not auto-sanitize inputs. All HTML email bodies need manual `escapeHtml` calls. Email headers need `stripNewlines` to prevent malicious injection via newlines.
**Prevention:** I have added `escapeHtml` and `stripNewlines` utilities to `src/lib/html-sanitizer.ts`. All future user inputs interpolated into email HTML must use `escapeHtml`. All future user inputs placed in email headers (like `subject` or `replyTo`) must use `stripNewlines`.
