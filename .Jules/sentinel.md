## 2025-01-28 - Missing Sanitization in Email Service
**Vulnerability:** HTML injection (XSS) in transactional emails.
**Learning:** `src/lib/utils.ts` was documented as having `escapeHtml` but it was missing from the implementation. The contact form was directly interpolating user input into HTML emails.
**Prevention:** Always verify that utility functions described in documentation/memory actually exist in the codebase. Ensure all user input in HTML emails is passed through `escapeHtml` before string interpolation.
