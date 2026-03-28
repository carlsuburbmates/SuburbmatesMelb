import { describe, expect, it } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/middleware/cors';

describe('CORS Middleware', () => {
  // Mock handler that returns a simple JSON response
  const mockHandler = async () => NextResponse.json({ success: true });
  // Wrap handler with CORS middleware
  const corsHandler = withCors(mockHandler);

  it('allows trusted origin (explicitly allowed)', async () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { origin: 'http://localhost:3000' }
    });
    const res = await corsHandler(req);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('blocks untrusted origin', async () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { origin: 'http://malicious-site.com' }
    });
    const res = await corsHandler(req);
    // Should return the default allowed origin (first in list) when blocked
    // The current implementation returns ALLOWED_ORIGINS[0] when not allowed
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('VULNERABILITY CHECK: currently allows malicious origin containing localhost', async () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { origin: 'http://evil-localhost.com' }
    });
    const res = await corsHandler(req);

    // If vulnerable, it returns the malicious origin
    // We want to assert that it DOES NOT return the malicious origin
    // But for reproduction, we expect this test to FAIL if we assert the secure behavior
    // So let's assert the SECURE behavior and expect it to FAIL

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('allows dynamic localhost ports (securely)', async () => {
    // This is what we want to support
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { origin: 'http://localhost:8080' }
    });
    const res = await corsHandler(req);

    // Once fixed, this should still work because we'll allow localhost regex
    // Currently it works because of the loose includes check
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8080');
  });
});
