## 2026-01-16 - API Route Security Pattern
**Vulnerability:** Contact form was missing input sanitization (XSS risk in emails) and rate limiting.
**Learning:** API routes need manual application of middleware wrappers (`withApiRateLimit`) and explicit input sanitization (`escapeHtml`) when generating HTML content (like emails).
**Prevention:** Always wrap public API routes with rate limiting middleware. Use `escapeHtml` for any user input rendered into HTML.
