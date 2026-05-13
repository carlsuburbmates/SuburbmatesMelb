# PRELAUNCH SAFETY MODE

## Current phase

SuburbMates public web is in **Melbourne beta prelaunch** with a **founding creator rollout**.
Profiles are published progressively, suburb-by-suburb, after review.

## Indexing policy

- `NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE` controls public indexing behavior.
- Default behavior is safety-on (`true` when unset):
  - page metadata sets `noindex, nofollow`
  - `robots.txt` disallows all crawling
- To exit prelaunch indexing lock, set:
  - `NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE=false`

## Fake/demo data policy

- Public APIs must not return demo/sample/placeholder entities as real listings.
- Backend API filters exclude entries that match any of the following terms in the name, slug, or description:
  - `demo`
  - `sample`
  - `placeholder`
  - `Launch Partner`
  - `test business`
- This filtering is enforced at the API layer (`executeDirectorySearch` in `src/lib/search.ts` and `/api/creator/[slug]`). The frontend is not responsible for truth filtering.
- Empty states should show rollout messaging instead of synthetic inventory.

## Exit criteria for removing prelaunch protections

Remove prelaunch protections only when all are true:

1. Backend truth and quality checks are stable for public directory reads.
2. Creator onboarding/review pipeline is operating reliably at scale.
3. Enough genuine profile density exists across rollout suburbs.
4. Product and ops approve re-enabling search indexing.
