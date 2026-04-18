# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vendor-auth.spec.ts >> Vendor API auth >> GET /api/vendor/featured-request requires auth
- Location: tests/e2e/vendor-auth.spec.ts:6:7

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED ::1:3010
Call log:
  - → GET http://localhost:3010/api/vendor/featured-request
    - user-agent: Playwright/1.59.1 (x64; ubuntu 24.04) node/22.22
    - accept: */*
    - accept-encoding: gzip,deflate,br

```