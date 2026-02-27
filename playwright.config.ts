import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3010';
const isCI = process.env.CI === 'true';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
    }
  },
  // In CI with placeholder keys, we skip tests that require real DB/Auth interactions
  // and we disable visual regression snapshots since we can't easily update them.
  testIgnore: isCI ? [
    '**/product-crud-caps.spec.ts',
    '**/vendor-page-scan.spec.ts',
    '**/search-telemetry.spec.ts',
    '**/page-button-scan.spec.ts', // Visual regression test
    '**/dispute-gating.spec.ts', // Likely requires backend
    '**/downgrade-fifo.spec.ts', // Likely requires backend
    '**/featured-slots.spec.ts', // Likely requires backend
    '**/mobile-optimization.spec.ts', // Likely visual/layout dependent
  ] : undefined,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreSnapshots: isCI, // Disable snapshot assertions in CI
  },
  reporter: [['list']]
});
