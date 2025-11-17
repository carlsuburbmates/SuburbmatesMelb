/**
 * SuburbMates V1.1 - Rate Limiting Middleware
 * In-memory rate limiting for API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { RATE_LIMITS } from '@/lib/constants';
import { logger } from '@/lib/logger';

// ============================================================================
// RATE LIMIT STORE
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (simple for MVP, use Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ============================================================================
// RATE LIMIT CONFIG
// ============================================================================

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests in window
  keyPrefix?: string; // Prefix for rate limit key
}

// Default configurations
export const RATE_LIMIT_CONFIGS = {
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: RATE_LIMITS.API_REQUESTS_PER_MINUTE,
    keyPrefix: 'api',
  },
  auth: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: RATE_LIMITS.AUTH_REQUESTS_PER_MINUTE,
    keyPrefix: 'auth',
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: RATE_LIMITS.UPLOAD_REQUESTS_PER_HOUR,
    keyPrefix: 'upload',
  },
};

// ============================================================================
// RATE LIMIT LOGIC
// ============================================================================

/**
 * Get client identifier (IP or user ID)
 */
function getClientId(req: NextRequest): string {
  // Try to get user ID from auth header
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    try {
      const token = authHeader.substring(7);
      // In production, decode JWT to get user ID
      // For now, use a hash of the token
      return `user:${token.substring(0, 16)}`;
    } catch {
      // Fall through to IP
    }
  }

  // Fall back to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `ip:${ip}`;
}

/**
 * Check rate limit
 */
export function checkRateLimit(
  clientId: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const key = `${config.keyPrefix}:${clientId}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);

  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    allowed,
    limit: config.maxRequests,
    remaining,
    resetAt: entry.resetAt,
  };
}

// ============================================================================
// RATE LIMIT MIDDLEWARE
// ============================================================================

export type RateLimitHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * Determine if rate limiting should be bypassed. Used for local testing and
 * automated test suites (Playwright) so that auth flows aren't throttled.
 */
function shouldBypassRateLimit(): boolean {
  return (
    process.env.DISABLE_RATE_LIMIT === "true" ||
    process.env.NODE_ENV === "test" ||
    process.env.SUBURBMATES_ENV === "test"
  );
}

/**
 * Apply rate limiting to route
 */
export function withRateLimit(
  handler: RateLimitHandler,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api
): RateLimitHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    if (shouldBypassRateLimit()) {
      return handler(req);
    }

    const clientId = getClientId(req);
    const result = checkRateLimit(clientId, config);

    // Add rate limit headers
    const headers = new Headers({
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    });

    // If rate limit exceeded
    if (!result.allowed) {
      logger.warn('Rate limit exceeded', {
        clientId,
        limit: result.limit,
        resetAt: new Date(result.resetAt).toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
          },
        },
        {
          status: 429,
          headers,
        }
      );
    }

    // Call handler
    const response = await handler(req);

    // Add rate limit headers to response
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }

    return response;
  };
}

// ============================================================================
// PRESET RATE LIMITERS
// ============================================================================

/**
 * Standard API rate limit (60 req/min)
 */
export function withApiRateLimit(handler: RateLimitHandler) {
  return withRateLimit(handler, RATE_LIMIT_CONFIGS.api);
}

/**
 * Strict auth rate limit (5 req/min)
 */
export function withAuthRateLimit(handler: RateLimitHandler) {
  return withRateLimit(handler, RATE_LIMIT_CONFIGS.auth);
}

/**
 * Upload rate limit (50 req/hour)
 */
export function withUploadRateLimit(handler: RateLimitHandler) {
  return withRateLimit(handler, RATE_LIMIT_CONFIGS.upload);
}
