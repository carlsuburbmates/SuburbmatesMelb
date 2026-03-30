## 2024-05-22 - Missing Rate Limiting and Unbounded Queries on Admin Endpoint
**Vulnerability:** The `GET /api/products` endpoint utilized `SUPABASE_SERVICE_ROLE_KEY` to fetch data (bypassing RLS) without rate limiting or upper bounds on the `limit` parameter. This exposed the application to Denial of Service (DoS) attacks via resource exhaustion and potential scraping abuse, as a user could request an arbitrary number of records.
**Learning:** Even when filtering logic correctly limits data visibility (e.g., `published: true`), the absence of operational safeguards (rate limits, pagination caps) on endpoints using privileged keys creates a significant availability risk. Security is not just about data confidentiality but also availability and resource management.
**Prevention:**
1.  **Mandatory Middleware:** All public API routes must be wrapped with `withApiRateLimit` and `withErrorHandler`.
2.  **Resource Caps:** Strictly validate and cap `limit` parameters (e.g., max 100) in the handler or via Zod schema.
3.  **Privileged Access Review:** Usage of `supabaseAdmin` (service role) should be audited to ensuring accompanying safeguards are robust.
