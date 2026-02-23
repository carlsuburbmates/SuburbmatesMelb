/**
 * SuburbMates V1.1 - CORS Middleware
 * Cross-Origin Resource Sharing configuration
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin',
];

// ============================================================================
// CORS MIDDLEWARE
// ============================================================================

export type CorsHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * Add CORS headers to route
 */
export function withCors(handler: CorsHandler): CorsHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    const origin = req.headers.get('origin') || '';

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin),
      });
    }

    // Call handler
    const response = await handler(req);

    // Add CORS headers to response
    const headers = getCorsHeaders(origin);
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }

    return response;
  };
}

/**
 * Check if origin is allowed
 */
export function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // Allow strict localhost with any port (http or https)
  // This prevents substring attacks like 'evil-localhost.com'
  const localhostRegex = /^https?:\/\/localhost(:\d+)?$/;
  return localhostRegex.test(origin);
}

/**
 * Get CORS headers for origin
 */
function getCorsHeaders(origin: string): Record<string, string> {
  const isAllowed = isAllowedOrigin(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
    'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}
