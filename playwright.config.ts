import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3010';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  // In CI without real credentials, skip tests that require a live backend.
  // We can determine this if NEXT_PUBLIC_SUPABASE_URL includes "placeholder".
  testIgnore: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
    ? ['tests/e2e/**']
    : undefined,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['list']]
});
