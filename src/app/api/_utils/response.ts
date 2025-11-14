/**
 * SuburbMates V1.1 - API Response Handlers
 * Standardized response formatting
 */

import { NextResponse } from 'next/server';
import { AppError, formatErrorResponse } from '@/lib/errors';

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
}

// ============================================================================
// SUCCESS RESPONSES
// ============================================================================

/**
 * Return success response with data
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200,
  meta?: SuccessResponse<T>['meta']
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status: statusCode }
  );
}

/**
 * Return 201 Created response
 */
export function createdResponse<T>(data: T): NextResponse<SuccessResponse<T>> {
  return successResponse(data, 201);
}

/**
 * Return 204 No Content response
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

/**
 * Return error response
 */
export function errorResponse(
  error: Error | AppError,
  statusCode: number = 500
): NextResponse<ErrorResponse> {
  const formattedError = formatErrorResponse(
    error,
    process.env.NODE_ENV === 'development'
  );

  return NextResponse.json(formattedError, { status: statusCode });
}

/**
 * Return 400 Bad Request
 */
export function badRequestResponse(
  message: string = 'Bad request',
  details?: Record<string, unknown>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message,
        details,
      },
    },
    { status: 400 }
  );
}

/**
 * Return 400 Validation Error
 */
export function validationErrorResponse(
  errors: Record<string, string>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { fields: errors },
      },
    },
    { status: 400 }
  );
}

/**
 * Return 401 Unauthorized
 */
export function unauthorizedResponse(
  message: string = 'Authentication required'
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
      },
    },
    { status: 401 }
  );
}

/**
 * Return 403 Forbidden
 */
export function forbiddenResponse(
  message: string = 'Access forbidden'
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message,
      },
    },
    { status: 403 }
  );
}

/**
 * Return 404 Not Found
 */
export function notFoundResponse(
  resource: string = 'Resource'
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `${resource} not found`,
      },
    },
    { status: 404 }
  );
}

/**
 * Return 409 Conflict
 */
export function conflictResponse(
  message: string = 'Resource already exists'
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'CONFLICT',
        message,
      },
    },
    { status: 409 }
  );
}

/**
 * Return 422 Unprocessable Entity
 */
export function unprocessableResponse(
  message: string,
  details?: Record<string, unknown>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNPROCESSABLE_ENTITY',
        message,
        details,
      },
    },
    { status: 422 }
  );
}

/**
 * Return 429 Too Many Requests
 */
export function tooManyRequestsResponse(
  retryAfter?: number
): NextResponse<ErrorResponse> {
  const response = NextResponse.json(
    {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        ...(retryAfter && { details: { retryAfter } }),
      },
    },
    { status: 429 }
  );

  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }

  return response as NextResponse<ErrorResponse>;
}

/**
 * Return 500 Internal Server Error
 */
export function internalErrorResponse(
  message: string = 'Internal server error'
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message,
      },
    },
    { status: 500 }
  );
}
