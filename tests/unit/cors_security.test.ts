import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/middleware/cors';

describe('CORS Middleware Security', () => {
  it('should reject malicious domains containing "localhost"', async () => {
    const handler = vi.fn().mockReturnValue(NextResponse.json({}));
    const wrappedHandler = withCors(handler);

    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        origin: 'http://evil-localhost.com',
      },
    });

    const res = await wrappedHandler(req);

    // Security Fix Verification: Should NOT allow the malicious origin
    expect(res.headers.get('Access-Control-Allow-Origin')).not.toBe('http://evil-localhost.com');

    // It should fall back to the first allowed origin (default safe behavior)
    // Note: ALLOWED_ORIGINS[0] is typically http://localhost:3000 in dev/test
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('should allow legitimate localhost origins', async () => {
    const handler = vi.fn().mockReturnValue(NextResponse.json({}));
    const wrappedHandler = withCors(handler);

    const validOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://localhost:3000',
    ];

    for (const origin of validOrigins) {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: { origin },
      });
      const res = await wrappedHandler(req);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    }
  });
});
