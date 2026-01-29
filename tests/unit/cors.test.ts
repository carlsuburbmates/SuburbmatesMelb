import { describe, it, expect, vi } from 'vitest';
import { withCors } from '@/middleware/cors';
import { NextRequest, NextResponse } from 'next/server';

describe('CORS Middleware', () => {
  it('should allow legitimate localhost origin', async () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    const handler = async () => NextResponse.json({ success: true });
    const corsHandler = withCors(handler);
    const res = await corsHandler(req);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('should allow localhost with dynamic port', async () => {
    const req = new NextRequest('http://localhost:8080/api/test', {
      headers: {
        origin: 'http://localhost:8080',
      },
    });

    const handler = async () => NextResponse.json({ success: true });
    const corsHandler = withCors(handler);
    const res = await corsHandler(req);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8080');
  });

  it('should BLOCK evil-localhost.com origin', async () => {
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        origin: 'http://evil-localhost.com',
      },
    });

    const handler = async () => NextResponse.json({ success: true });
    const corsHandler = withCors(handler);
    const res = await corsHandler(req);

    // Should default to the first allowed origin instead of reflecting the evil one
    // We expect it NOT to be the evil origin.
    expect(res.headers.get('Access-Control-Allow-Origin')).not.toBe('http://evil-localhost.com');
  });
});
