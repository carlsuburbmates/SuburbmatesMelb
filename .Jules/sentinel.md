# Sentinel's Journal

## 2025-01-18 - HTML Injection in Transactional Emails
**Vulnerability:** User-provided data (e.g., first name, business name) was being interpolated directly into HTML email strings without sanitization. This allowed attackers to inject malicious HTML/script tags into emails sent to users (Stored XSS/HTML Injection).
**Learning:** The email service treated all string inputs as safe HTML. Relying on simple string interpolation for HTML generation is inherently insecure when dealing with user input.
**Prevention:**
1.  Created a centralized `escapeHtml` utility in `src/lib/utils.ts`.
2.  Enforced usage of `escapeHtml` for all dynamic data in email templates in `src/lib/email.ts`.
3.  Added unit tests to verify sanitization.
