# Sentinel's Journal

## 2024-05-22 - Public Endpoint Vulnerabilities
**Vulnerability:** Public API endpoints (like `/api/contact`) were unprotected by rate limiting and used inconsistent logging (`console.error`).
**Learning:** Next.js App Router handlers require explicit wrapping with middleware for rate limiting and error handling; it's not automatic. Standard `Request` vs `NextRequest` typing mismatch can lead to middleware incompatibility.
**Prevention:** Always wrap public-facing API routes with `withApiRateLimit`, `withLogging`, and `withErrorHandler`. Enforce use of `NextRequest` for compatibility.
