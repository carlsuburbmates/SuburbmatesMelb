/**
 * SuburbMates V1.1 - Middleware Exports
 * Central export point for all middleware
 */

// Authentication
export { withAuth, withAdmin, withVendor, withUser, getUserFromRequest } from './auth';
export type { AuthContext, AuthenticatedHandler, AuthOptions } from './auth';

// Rate Limiting
export { 
  withRateLimit, 
  withApiRateLimit, 
  withAuthRateLimit, 
  withUploadRateLimit,
  RATE_LIMIT_CONFIGS,
} from './rateLimit';
export type { RateLimitConfig, RateLimitHandler } from './rateLimit';

// CORS
export { withCors } from './cors';
export type { CorsHandler } from './cors';

// Logging
export { withLogging } from './logging';
export type { LoggingHandler } from './logging';

// Error Handling
export { withErrorHandler } from './errorHandler';
export type { ErrorHandler } from './errorHandler';
