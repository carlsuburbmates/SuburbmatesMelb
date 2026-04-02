# Sentinel's Journal

## 2024-05-22 - Supabase Admin Client Misuse
**Vulnerability:** The API route `src/app/api/vendor/profile/route.ts` was prioritizing `supabaseAdmin` (service role) over `createSupabaseClient(token)` (user role), bypassing Row Level Security (RLS).
**Learning:** Defaulting to an admin client when available in a user context is a dangerous pattern. Code that runs on the server often has access to admin keys, but should explicitly choose the least-privileged client.
**Prevention:** Always use the user-scoped client (`createSupabaseClient(token)`) for user-initiated actions. Only use `supabaseAdmin` for background jobs or specific admin-only overrides.
