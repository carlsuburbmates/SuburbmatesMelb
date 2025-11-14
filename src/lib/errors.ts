/**
 * SuburbMates V1.1 - Error Handling
 * Standardized error classes and handling
 */

import { ERROR_CODES, ErrorCode } from './constants';

// ============================================================================
// BASE ERROR CLASS
// ============================================================================

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

// ============================================================================
// AUTHENTICATION ERRORS (401)
// ============================================================================

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.UNAUTHORIZED, 401, true, details);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid email or password', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.INVALID_CREDENTIALS, 401, true, details);
  }
}

export class SessionExpiredError extends AppError {
  constructor(message: string = 'Session has expired', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.SESSION_EXPIRED, 401, true, details);
  }
}

// ============================================================================
// AUTHORIZATION ERRORS (403)
// ============================================================================

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.FORBIDDEN, 403, true, details);
  }
}

export class InsufficientPermissionsError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.INSUFFICIENT_PERMISSIONS, 403, true, details);
  }
}

// ============================================================================
// RESOURCE ERRORS (404)
// ============================================================================

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, unknown>) {
    super(`${resource} not found`, ERROR_CODES.NOT_FOUND, 404, true, details);
  }
}

export class ResourceDeletedError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, unknown>) {
    super(`${resource} has been deleted`, ERROR_CODES.RESOURCE_DELETED, 404, true, details);
  }
}

// ============================================================================
// VALIDATION ERRORS (400)
// ============================================================================

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400, true, details);
  }
}

export class InvalidInputError extends AppError {
  constructor(field: string, message?: string, details?: Record<string, unknown>) {
    const errorMessage = message || `Invalid input for field: ${field}`;
    super(errorMessage, ERROR_CODES.INVALID_INPUT, 400, true, { field, ...details });
  }
}

export class MissingRequiredFieldError extends AppError {
  constructor(field: string, details?: Record<string, unknown>) {
    super(`Missing required field: ${field}`, ERROR_CODES.MISSING_REQUIRED_FIELD, 400, true, { field, ...details });
  }
}

// ============================================================================
// CONFLICT ERRORS (409)
// ============================================================================

export class AlreadyExistsError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, unknown>) {
    super(`${resource} already exists`, ERROR_CODES.ALREADY_EXISTS, 409, true, details);
  }
}

// ============================================================================
// BUSINESS LOGIC ERRORS (422)
// ============================================================================

export class QuotaExceededError extends AppError {
  constructor(quotaType: string, limit: number, details?: Record<string, unknown>) {
    super(
      `${quotaType} quota exceeded. Limit: ${limit}`,
      ERROR_CODES.QUOTA_EXCEEDED,
      422,
      true,
      { quotaType, limit, ...details }
    );
  }
}

export class VendorNotActiveError extends AppError {
  constructor(message: string = 'Vendor account is not active', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.VENDOR_NOT_ACTIVE, 422, true, details);
  }
}

export class VendorSuspendedError extends AppError {
  constructor(reason?: string, details?: Record<string, unknown>) {
    const message = reason
      ? `Vendor account suspended: ${reason}`
      : 'Vendor account is suspended';
    super(message, ERROR_CODES.VENDOR_SUSPENDED, 422, true, { reason, ...details });
  }
}

export class StripeNotConnectedError extends AppError {
  constructor(message: string = 'Stripe account not connected', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.STRIPE_NOT_CONNECTED, 422, true, details);
  }
}

// ============================================================================
// PAYMENT ERRORS (402)
// ============================================================================

export class PaymentFailedError extends AppError {
  constructor(message: string = 'Payment processing failed', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.PAYMENT_FAILED, 402, true, details);
  }
}

export class RefundFailedError extends AppError {
  constructor(message: string = 'Refund processing failed', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.REFUND_FAILED, 402, true, details);
  }
}

export class InvalidAmountError extends AppError {
  constructor(message: string = 'Invalid payment amount', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.INVALID_AMOUNT, 400, true, details);
  }
}

// ============================================================================
// SYSTEM ERRORS (500)
// ============================================================================

export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.INTERNAL_ERROR, 500, false, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: Record<string, unknown>) {
    super(message, ERROR_CODES.DATABASE_ERROR, 500, false, details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string, details?: Record<string, unknown>) {
    const errorMessage = message || `External service error: ${service}`;
    super(errorMessage, ERROR_CODES.EXTERNAL_SERVICE_ERROR, 500, true, { service, ...details });
  }
}

// ============================================================================
// ERROR RESPONSE FORMATTER
// ============================================================================

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error | AppError, includeStack: boolean = false): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        ...(includeStack && { stack: error.stack }),
      },
    };
  }

  // Handle unknown errors
  return {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: error.message || 'An unexpected error occurred',
      ...(includeStack && { stack: error.stack }),
    },
  };
}

// ============================================================================
// ERROR HANDLER MIDDLEWARE
// ============================================================================

/**
 * Check if error is operational (expected)
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Log error appropriately based on type
 */
export function logError(error: Error | AppError): void {
  if (error instanceof AppError) {
    if (error.isOperational) {
      // Operational errors - log as warning
      console.warn(`[${error.code}] ${error.message}`, {
        statusCode: error.statusCode,
        details: error.details,
      });
    } else {
      // Programming errors - log as error with stack
      console.error(`[${error.code}] ${error.message}`, {
        statusCode: error.statusCode,
        details: error.details,
        stack: error.stack,
      });
    }
  } else {
    // Unknown errors - log as error
    console.error('Unexpected error:', error.message, {
      stack: error.stack,
    });
  }
}

// ============================================================================
// VALIDATION ERROR HELPERS
// ============================================================================

/**
 * Convert Zod error to ValidationError
 */
export function zodErrorToValidationError(error: { issues: Array<{ path: string[]; message: string }> }): ValidationError {
  const details: Record<string, string> = {};
  
  error.issues.forEach(issue => {
    const field = issue.path.join('.');
    details[field] = issue.message;
  });

  return new ValidationError('Validation failed', { fields: details });
}

/**
 * Create validation error from field issues
 */
export function createValidationError(fields: Record<string, string>): ValidationError {
  return new ValidationError('Validation failed', { fields });
}

// ============================================================================
// ERROR BOUNDARY HELPERS
// ============================================================================

/**
 * Wrap async function with error handling
 */
export function asyncErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return (await fn(...args)) as ReturnType<T>;
    } catch (error) {
      logError(error as Error);
      throw error;
    }
  };
}

/**
 * Safe async handler that catches and formats errors
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<{ data: T | null; error: ErrorResponse | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    logError(error as Error);
    return {
      data: null,
      error: formatErrorResponse(error as Error, process.env.NODE_ENV === 'development'),
    };
  }
}

// ============================================================================
// HTTP STATUS CODE HELPERS
// ============================================================================

/**
 * Get HTTP status code from error
 */
export function getStatusCode(error: Error | AppError): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

/**
 * Check if error should be retried
 */
export function isRetryableError(error: Error | AppError): boolean {
  if (error instanceof AppError) {
    // Retry on 5xx errors and specific 4xx errors
    return error.statusCode >= 500 || error.statusCode === 429;
  }
  return false;
}

// ============================================================================
// ERROR FACTORY
// ============================================================================

/**
 * Create appropriate error from error code
 */
export function createError(
  code: ErrorCode,
  message?: string,
  details?: Record<string, unknown>
): AppError {
  switch (code) {
    case ERROR_CODES.UNAUTHORIZED:
      return new UnauthorizedError(message, details);
    case ERROR_CODES.FORBIDDEN:
      return new ForbiddenError(message, details);
    case ERROR_CODES.NOT_FOUND:
      return new NotFoundError(message || 'Resource', details);
    case ERROR_CODES.VALIDATION_ERROR:
      return new ValidationError(message, details);
    case ERROR_CODES.QUOTA_EXCEEDED:
      return new QuotaExceededError(
        details?.quotaType as string || 'Resource',
        details?.limit as number || 0,
        details
      );
    case ERROR_CODES.VENDOR_SUSPENDED:
      return new VendorSuspendedError(details?.reason as string, details);
    case ERROR_CODES.PAYMENT_FAILED:
      return new PaymentFailedError(message, details);
    default:
      return new AppError(message || 'An error occurred', code, 500, true, details);
  }
}
