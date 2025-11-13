# Suburbmates V1.1 — Clean Architecture Monorepo

## Structure

- **src/app/** — Next.js App Router application
- **v1.1-docs/** — Full SSOT documentation
- **.github/** — CI enforcement + Copilot PR rules
- **.vscode/** — Workspace guardrails

## Principles

- Vendor-as-Merchant-of-Record
- Directory ≠ Marketplace
- Platform never issues refunds
- Stripe Connect Standard
- Supabase Postgres
- TypeScript strict mode

## Enforcement

- Forbidden strings scanner
- Required SSOT terms scanner
- Architecture validator
- Schema drift detector
- Copilot PR reviewer rules

This repository is designed for stability, correctness, and compliance.
