# 📖 Suburbmates Project Bible (Legacy/Architecture Reference)
> **⚠️ NON-AUTHORITATIVE**
> This file is for architectural reference only.
> **Product truth, positioning, and public claims live ONLY in [`docs/README.md`](./README.md).**
> Do not use this file for business rules, copy, or pricing limits.

## 1. Executive Summary
Suburbmates is a multi-sided marketplace for Melbourne digital creators.
*Refer to README.md for current positioning.*

---

## 2. Architecture & Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org) (App Router).
- **Language**: TypeScript 5.
- **Styling**: Tailwind CSS 3.4.

### Backend (Serverless)
- **Database**: Supabase.
- **Auth**: Supabase Auth / NextAuth.
- **API**: Next.js Route Handlers.

### Integrations (Architecture Only)
- **Payments**: Stripe Connect.
- **Email**: Resend.
- **Maps**: Mapbox (UNVERIFIED).

---

## 3. Route Inventory (Reference)

| Route | File path | Purpose |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Landing page |
| `/directory` | `src/app/directory/page.tsx` | Creator Directory |
| `/business/[slug]` | `src/app/business/[slug]/page.tsx` | Creator Profile |
| `/marketplace` | `src/app/marketplace/page.tsx` | Marketplace Listing |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | Product Detail |

*Note: See verified file tree for definitive route list.*

---

## 4. API Surface (Reference)
*   `/api/auth/[...nextauth]`
*   `/api/business`
*   `/api/checkout`
*   `/api/webhook/stripe`
*   `/api/vendor`
*   `/api/search`

---

## 5. Data Model (Reference)
*See `src/lib/database.types.ts` for the SSOT schema.*

*   `users`
*   `vendors`
*   `business_profiles`
*   `products`
*   `orders`
*   `featured_slots`



