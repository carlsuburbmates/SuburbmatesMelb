
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/middleware/rateLimit';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({
      headers: new Headers(),
    })),
    json: vi.fn((body, options) => ({
      body,
      status: options?.status,
      headers: options?.headers || new Headers(),
    })),
  },
  NextRequest: class {
    headers: Headers;
    url: string;

    constructor(url: string, init?: any) {
      this.url = url;
      this.headers = new Headers(init?.headers);
    }
  }
}));

describe('Middleware - Rate Limit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Force rate limit to be enabled by ensuring bypass returns false
    process.env.DISABLE_RATE_LIMIT = 'false';
    process.env.NODE_ENV = 'production';
    process.env.SUBURBMATES_ENV = 'production';
  });

  it('should allow requests within limit', async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.next());
    const wrappedHandler = withRateLimit(handler, {
      ...RATE_LIMIT_CONFIGS.api,
      maxRequests: 2, // Low limit for testing
      windowMs: 1000
    });

    const req = new NextRequest('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '1.2.3.4' }
    });

    // First request
    const res1 = await wrappedHandler(req);
    expect(handler).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(res1.headers.get('X-RateLimit-Remaining')).toBe('1');

    // Second request
    const res2 = await wrappedHandler(req);
    expect(handler).toHaveBeenCalledTimes(2);
    // @ts-ignore
    expect(res2.headers.get('X-RateLimit-Remaining')).toBe('0');
  });

  it('should block requests exceeding limit', async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.next());
    const wrappedHandler = withRateLimit(handler, {
      ...RATE_LIMIT_CONFIGS.api,
      maxRequests: 1, // Limit 1
      windowMs: 1000
    });

    const req = new NextRequest('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '5.6.7.8' }
    });

    // First request - OK
    await wrappedHandler(req);

    // Second request - Blocked
    const res2 = await wrappedHandler(req);

    expect(handler).toHaveBeenCalledTimes(1); // Not called 2nd time
    // @ts-ignore
    expect(res2.status).toBe(429);
    // Use type assertion or checking body structure if it's mocked as object
    // @ts-ignore
    expect(res2.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
