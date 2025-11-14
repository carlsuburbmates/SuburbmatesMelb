/**
 * SuburbMates V1.1 - Error Handling Middleware
 * Catch and format all errors from routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { AppError, formatErrorResponse, logError, getStatusCode } from '@/lib/errors';

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

export type ErrorHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * Wrap route with error handling
 */
export function withErrorHandler(handler: ErrorHandler): ErrorHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      // Log the error
      logError(error as Error);

      // Get status code
      const statusCode = error instanceof AppError 
        ? getStatusCode(error)
        : 500;

      // Format error response
      const errorResponse = formatErrorResponse(
        error as Error,
        process.env.NODE_ENV === 'development'
      );

      // Return error response
      return NextResponse.json(errorResponse, { status: statusCode });
    }
  };
}
