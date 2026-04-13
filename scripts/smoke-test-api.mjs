#!/usr/bin/env node
// Simple smoke test for key routes and API endpoints

const base = process.env.SM_BASE_URL || 'http://localhost:3010';

const routes = [
  { path: '/', expect: 200, method: 'GET' },
  { path: '/regions', expect: 200, method: 'GET' },
  { path: '/robots.txt', expect: 200, method: 'GET' },
  { path: '/sitemap.xml', expect: 200, method: 'GET' },
  // Dynamic page will 404 without seeded data; this is acceptable
  { path: '/creator/test-slug', expect: 404, method: 'GET' },
  {
    path: '/api/search',
    expect: 200,
    method: 'POST',
    body: { query: "" }
  },
];

async function check(route) {
  const { path, expect, method, body } = route;
  const url = base + path;
  const start = Date.now();
  try {
    const options = {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(url, options);
    const ms = Date.now() - start;
    const ok = res.status === expect;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${res.status} ${ms}ms ${method} ${url}`);
    if (!ok) return 1;
    return 0;
  } catch (e) {
    const ms = Date.now() - start;
    console.log(`ERROR after ${ms}ms ${method} ${url}:`, e.message);
    return 1;
  }
}

(async () => {
  let failures = 0;
  for (const r of routes) {
    failures += await check(r);
  }
  if (failures > 0) {
    console.error(`\nSmoke test failed: ${failures} routes unexpected.`);
    process.exit(1);
  }
  console.log('\nSmoke test passed.');
})();
