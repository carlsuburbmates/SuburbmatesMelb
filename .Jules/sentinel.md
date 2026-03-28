## 2024-05-22 - Secure Public API Pattern
**Vulnerability:** Public API endpoints (like `GET /api/products`) accessing the database via `supabaseAdmin` (bypassing RLS) without rate limiting or input caps are vulnerable to DoS and resource exhaustion.
**Learning:** Even "read-only" public endpoints need strict protection when they bypass RLS. Middleware composition is critical.
**Prevention:**
1. Always wrap public APIs with `withErrorHandler(withLogging(withApiRateLimit(handler)))`.
2. Explicitly validate and CAP all list/search parameters (e.g., `limit` max 100).
3. Use `supabaseAdmin` only when necessary and validated; prefer user context where possible.
