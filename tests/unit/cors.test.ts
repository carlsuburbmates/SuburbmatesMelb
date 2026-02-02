import { describe, expect, it } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/middleware/cors';

describe('CORS Middleware', () => {
  const mockHandler = async () => new NextResponse('ok');
  const wrappedHandler = withCors(mockHandler);

  it('allows valid localhost origin', async () => {
    const req = new NextRequest('http://localhost:3000', {
      headers: { Origin: 'http://localhost:3000' }
    });

    const res = await wrappedHandler(req);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('blocks malicious localhost origin', async () => {
    const evilOrigin = 'http://evil-localhost.com';
    const req = new NextRequest('http://localhost:3000', {
      headers: { Origin: evilOrigin }
    });

    const res = await wrappedHandler(req);
    // Should fallback to the first allowed origin (http://localhost:3000 usually)
    expect(res.headers.get('Access-Control-Allow-Origin')).not.toBe(evilOrigin);
  });
});
