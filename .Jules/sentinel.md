## 2025-02-23 - DoS Vulnerability in Products API
**Vulnerability:** The public products API (`/api/products`) accepted an uncapped `limit` parameter, allowing potential Denial of Service (DoS) via resource exhaustion if a malicious actor requested a very large number of records.
**Learning:** Next.js API routes that bypass RLS (using `SUPABASE_SERVICE_ROLE_KEY`) must manually implement all safety checks, including rate limiting and query capping, which are otherwise handled by RLS or Supabase configuration.
**Prevention:** Always wrap public API routes with `withApiRateLimit` middleware and explicitly cap user-provided limit parameters using `Math.min(limit, MAX_LIMIT)`.
