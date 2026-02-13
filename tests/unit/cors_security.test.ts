
import { describe, it, expect } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/middleware/cors';

describe('CORS Middleware Security', () => {
  it('should not allow evil-localhost.com origin', async () => {
    // Mock handler
    const handler = async () => {
      return NextResponse.json({ success: true });
    };

    // Wrap handler with CORS middleware
    const protectedHandler = withCors(handler);

    // Create request with malicious origin
    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'Origin': 'http://evil-localhost.com',
      },
    });

    // Execute handler
    const res = await protectedHandler(req);

    // Check Access-Control-Allow-Origin header
    const allowOrigin = res.headers.get('Access-Control-Allow-Origin');

    // It should NOT be the malicious origin
    // If vulnerable, it returns the malicious origin because of .includes('localhost')
    expect(allowOrigin).not.toBe('http://evil-localhost.com');
  });

  it('should allow valid localhost origin', async () => {
    const handler = async () => {
      return NextResponse.json({ success: true });
    };

    const protectedHandler = withCors(handler);

    const req = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'Origin': 'http://localhost:3000',
      },
    });

    const res = await protectedHandler(req);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('should allow valid localhost with port', async () => {
    const handler = async () => {
      return NextResponse.json({ success: true });
    };

    const protectedHandler = withCors(handler);

    const req = new NextRequest('http://localhost:8080/api/test', {
        headers: {
        'Origin': 'http://localhost:8080',
        },
    });

    const res = await protectedHandler(req);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8080');
  });
});
