# Reports Directory

- **Current evidence**: keep the latest manual QA log, SSOT verification, and analytics JSON in this folder for quick reference.
- **Archive**: move previous cycles into `reports/archive/<yyyy-mm-dd>/`. Example: `reports/archive/2025-11-19/featured-slot-qa-*.md`.
- **Assets**: place screenshots or ancillary files under `reports/assets/`.

When generating a new QA report or script output:
1. Write it to `reports/` first so it’s easy to review in the PR.
2. After the next cycle starts, move the older artifact into `reports/archive/<date>/` and update any markdown references (e.g., manual QA log) to point to the archived path.
