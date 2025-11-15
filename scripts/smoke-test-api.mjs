#!/usr/bin/env node
// Simple smoke test for key routes and API endpoints

const base = process.env.SM_BASE_URL || 'http://localhost:3010';

const routes = [
  { path: '/', expect: 200 },
  { path: '/directory', expect: 200 },
  { path: '/marketplace', expect: 200 },
  { path: '/robots.txt', expect: 200 },
  { path: '/sitemap.xml', expect: 200 },
  { path: '/api/business', expect: 200 },
  // Dynamic page will 404 without seeded data; this is acceptable
  { path: '/business/test-slug', expect: 404 },
];

async function check(path, expect) {
  const url = base + path;
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'GET' });
    const ms = Date.now() - start;
    const ok = res.status === expect;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${res.status} ${ms}ms ${url}`);
    if (!ok) return 1;
    return 0;
  } catch (e) {
    const ms = Date.now() - start;
    console.log(`ERROR after ${ms}ms ${url}:`, e.message);
    return 1;
  }
}

(async () => {
  let failures = 0;
  for (const r of routes) {
    failures += await check(r.path, r.expect);
  }
  if (failures > 0) {
    console.error(`\nSmoke test failed: ${failures} routes unexpected.`);
    process.exit(1);
  }
  console.log('\nSmoke test passed.');
})();
