# Suburbmates v1.1 — API Reference (v3.1)

> Last updated: 19 November 2025  
> Sources: 04.0_COMPLETE_SPECIFICATION, 04.1_API_SPECIFICATION, 04.2_ENDPOINTS_REFERENCE, SSOT Development Handbook.  
> Guardrails: Vendor = merchant of record (Stripe Connect Standard), platform non-mediating, no SLAs, commission non-refundable, ABN optional but incentivized.

This master file consolidates every Stage 3 API detail. Each section points back to the legacy specs for provenance; the superseded files now live in `ARCHIVED_DOCS/legacy_api/`.

---

## 1. Platform Overview
- **Transport:** HTTPS JSON APIs deployed through Next.js App Router (`src/app/api/*`).
- **Auth:** Supabase Auth (email magic link). Vendor-protected routes use the Supabase session. Server-to-Supabase calls require the `supabaseAdmin` client (env: `SUPABASE_SERVICE_ROLE_KEY`).
- **Rate limiting:** Enforced via middleware (IP + session) and Supabase RLS. Max 60 write ops / minute / user.
- **Error envelope:** `{ "error": { "code": "string", "message": "string", "details": any } }` with appropriate HTTP codes.

## 2. Authentication & Session Endpoints
| Endpoint | Method | Description | Notes |
| --- | --- | --- | --- |
| `/api/auth/signup` | POST | Creates Supabase auth user + vendor shell. | Validates email, password, marketing consent. Returns session + vendor_id. |
| `/api/auth/login` | POST | Magic-link or password login. | Issues Supabase session cookie, returns vendor metadata. |
| `/api/auth/logout` | POST | Revokes session. | Clears Supabase cookie. |

Supabase handles forgotten password flows; our API surfaces friendly errors only (never the Supabase reason).

## 3. Directory & Business Profile APIs
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/business` | GET | Public directory listing (paginated). Accepts `suburb`, `category`, `tier`, `featuredOnly`. |
| `/api/business` | POST | Vendor creates/updates their profile (name, bio, suburb, contact, optional ABN). Persists to `business_profiles`. |
| `/api/business/slug-check` | GET | Validates profile slug uniqueness. |

Rules: Directory endpoints never expose product pricing; each profile returns up to four published product previews and a link to `/marketplace`.

## 4. Product & Tier APIs
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/vendor/products` | POST | Create product (title, description, price, category, asset reference, publish flag). Enforces tier cap + slug uniqueness. |
| `/api/vendor/products/[id]` | PATCH | Update product fields; optionally regenerates slug if title changed. |
| `/api/vendor/products/[id]` | DELETE | Soft delete + storage cleanup. |
| `/api/vendor/tier` | GET | Returns current tier, quota usage, available upgrades/downgrades. |
| `/api/vendor/tier` | PATCH | Upgrade/downgrade tier. Upgrades may trigger Stripe subscription; downgrades enforce FIFO unpublish. |

Tier limits (Basic 10, Pro unlimited) also enforced in DB triggers (`products_enforce_tier_cap`).

## 5. Featured Business APIs
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/vendor/featured-slots` | GET | Returns vendor’s active slots + queue position per suburb. |
| `/api/vendor/featured-slots` | POST | Initiates Stripe Checkout for $20 / 30-day featured placement. Body: `{ suburb_label, business_profile_id }`. Metadata includes `lga_id`, `suburb_label`, `business_profile_id`. |
| `/api/vendor/featured-slots/[slotId]/cancel` | POST | Cancels pending queue entry (if not yet promoted). |

Search + directory ranking automatically surface featured businesses for their suburb ahead of standard listings.

## 6. Search, Telemetry & Analytics
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/search` | POST | Executes Supabase RPC to fetch published businesses/products filtered by suburb/category/tier. Response includes `result_count`, featured flag, tier grouping order (Premium → Standard → Basic → Directory). |
| `/api/search/telemetry` | POST | Writes `{ query, filters, result_count, session_id }` to `search_logs` with SHA-256 hashing (`SEARCH_SALT`). Emits PostHog `search_query` event when key present. |
| `/api/analytics/search` | GET | Vendor-only analytics (top queries, zero-result searches, impressions). Powers dashboard charts. |

All search requests call telemetry exactly once; server handles empty filters by defaulting to “all categories / any tier” while still requiring a suburb selection.

## 7. Checkout, Orders & Webhooks
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/checkout` | POST | Creates Stripe Checkout Session for marketplace purchase. Body includes `product_id`, `quantity`, `success_url`, `cancel_url`. | 
| `/api/webhook/stripe` | POST | Handles `checkout.session.completed`, `charge.dispute.created/closed`, `customer.subscription.*`, `account.updated`. Updates `orders`, `transactions_log`, triggers dispute gating & tier changes. |
| `/api/vendor/connect/callback` | GET | Stripe Connect OAuth callback; stores `stripe_account_id` and onboarding status. |

Checkout always uses `payment_intent_data.application_fee_amount` and `transfer_data.destination` to keep the vendor as merchant of record.

## 8. Supporting Utilities
- `/api/vendor/storage` (POST): issues signed upload URLs, enforces storage quota per tier.
- `/api/vendor/notifications` (GET): lists unread operational notices (tier at cap, disputes, cron alerts).
- `/api/system/status` (GET): internal health for Verifier agent; returns cron freshness.

## 9. Data Contracts & Common Types
- **ID format:** UUIDv4 for most tables, numeric for Supabase auth IDs.
- **Currency:** Always cents (integer) in requests/responses; UI converts to AUD.
- **Timestamp:** ISO 8601 UTC.
- **Feature flags:** Response payloads may include `beta` objects; clients should ignore unknown fields.

## 10. Source Mapping
| New Section | Legacy Sources |
| --- | --- |
| Overview & auth | `04.0_COMPLETE_SPECIFICATION.md` §1-2 |
| Directory/business | `04.0` §3, `04.2` table “Directory APIs” |
| Products & tiers | `04.1_API_SPECIFICATION.md` tables 4–6 |
| Featured | `04.0` §5, `04.2` “Featured Slots” |
| Search/telemetry | `04.1` telemetry appendix, `04.2` “Search APIs” |
| Checkout/webhooks | `04.0` §7, `stripe-acl-quick-ref.md` |
| Utilities | `04.2` misc endpoints |

Future API changes should update this file first and then log the delta in `00_MASTER_DECISIONS.md` if they affect non-negotiables.
