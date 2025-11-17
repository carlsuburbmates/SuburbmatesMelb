import { test, expect } from '@playwright/test';

const paths = ['/', '/directory', '/marketplace', '/robots.txt', '/sitemap.xml'];

test.describe('Core routes', () => {
  for (const p of paths) {
    test(`GET ${p} returns content`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      const res = await page.goto(p, { waitUntil: 'domcontentloaded' });
      expect(res, `No response for ${p}`).toBeTruthy();
      expect(res!.ok(), `Non-OK status for ${p}: ${res!.status()}`).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();
      expect(errors, `Console errors on ${p}:\n${errors.join('\n')}`).toHaveLength(0);
    });
  }
});

test('Business page returns 404 for placeholder slug', async ({ page }) => {
  const res = await page.goto('/business/test-slug', { waitUntil: 'domcontentloaded' });
  expect(res).toBeTruthy();
  expect(res!.status()).toBe(404);
});
