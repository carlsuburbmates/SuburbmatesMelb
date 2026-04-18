# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic.spec.ts >> Core routes >> GET /sitemap.xml returns content
- Location: tests/e2e/basic.spec.ts:7:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3010/sitemap.xml
Call log:
  - navigating to "http://localhost:3010/sitemap.xml", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | const paths = ['/', '/regions', '/robots.txt', '/sitemap.xml'];
  4  |
  5  | test.describe('Core routes', () => {
  6  |   for (const p of paths) {
  7  |     test(`GET ${p} returns content`, async ({ page }) => {
  8  |       const errors: string[] = [];
  9  |       page.on('console', (msg) => {
  10 |         if (msg.type() !== 'error') {
  11 |           return;
  12 |         }
  13 |         const text = msg.text();
  14 |         if (
  15 |           text.includes('Failed to load resource') &&
  16 |           (text.includes('404') || text.includes('400'))
  17 |         ) {
  18 |           return;
  19 |         }
  20 |         if (text.includes('Failed to fetch directory listings')) {
  21 |           return;
  22 |         }
  23 |         errors.push(text);
  24 |       });
> 25 |       const res = await page.goto(p, { waitUntil: 'domcontentloaded' });
     |                              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3010/sitemap.xml
  26 |       expect(res, `No response for ${p}`).toBeTruthy();
  27 |       expect(res!.ok(), `Non-OK status for ${p}: ${res!.status()}`).toBeTruthy();
  28 |       await expect(page.locator('body')).toBeVisible();
  29 |       expect(errors, `Console errors on ${p}:\n${errors.join('\n')}`).toHaveLength(0);
  30 |     });
  31 |   }
  32 | });
  33 |
  34 | test('Business page returns 404 for placeholder slug', async ({ page }) => {
  35 |   const res = await page.goto('/business/test-slug', { waitUntil: 'domcontentloaded' });
  36 |   expect(res).toBeTruthy();
  37 |   expect(res!.status()).toBe(404);
  38 | });
  39 |
```