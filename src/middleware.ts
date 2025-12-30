
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRateLimit, withCors, RATE_LIMIT_CONFIGS } from '@/middleware/index';

/**
 * Main Middleware Handler
 *
 * Chains global middlewares:
 * 1. CORS
 * 2. Rate Limiting
 */
async function middlewareHandler(req: NextRequest) {
  // If we reach here, all middlewares passed
  return NextResponse.next();
}

// Chain middlewares
// Execution order is inverse of nesting: withCors calls withRateLimit which calls handler
// So: Cors -> RateLimit -> Handler
export const middleware = withCors(
  withRateLimit(middlewareHandler, RATE_LIMIT_CONFIGS.api)
);

export const config = {
  // Apply to all API routes
  matcher: '/api/:path*',
};
