import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/middleware/cors';

describe('CORS Middleware Security', () => {
  it('should allow legitimate localhost origin', async () => {
    const handler = vi.fn().mockResolvedValue(new NextResponse());
    const wrappedHandler = withCors(handler);

    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { origin: 'http://localhost:3000' }
    });

    const res = await wrappedHandler(req);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('should NOT allow evil localhost domain', async () => {
    const handler = vi.fn().mockResolvedValue(new NextResponse());
    const wrappedHandler = withCors(handler);

    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: { origin: 'http://evil-localhost.com' }
    });

    const res = await wrappedHandler(req);

    // If vulnerable, it returns 'http://evil-localhost.com'
    // If fixed, it should return the default allowed origin
    expect(res.headers.get('Access-Control-Allow-Origin')).not.toBe('http://evil-localhost.com');
  });
});
