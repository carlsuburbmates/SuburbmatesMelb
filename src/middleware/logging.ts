/**
 * SuburbMates V1.1 - Request Logging Middleware
 * Log all API requests for monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { logRequest } from '@/lib/logger';

// ============================================================================
// LOGGING MIDDLEWARE
// ============================================================================

export type LoggingHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * Log API requests
 */
export function withLogging(handler: LoggingHandler): LoggingHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const { method, url } = req;

    // Extract user info from Authorization header (if present)
    const authHeader = req.headers.get('authorization');
    let userId: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // In a real implementation, decode JWT to get user ID
      // For now, just log that it's authenticated
      userId = 'authenticated';
    }

    try {
      // Call handler
      const response = await handler(req);
      const durationMs = Date.now() - startTime;

      // Log request
      logRequest({
        method,
        url,
        statusCode: response.status,
        durationMs,
        userId,
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || undefined,
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - startTime;

      // Log failed request
      logRequest({
        method,
        url,
        statusCode: 500,
        durationMs,
        userId,
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || undefined,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  };
}
