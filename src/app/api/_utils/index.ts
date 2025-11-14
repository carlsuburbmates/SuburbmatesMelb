/**
 * SuburbMates V1.1 - API Utilities Exports
 * Central export point for all API utilities
 */

// Response Handlers
export {
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
  badRequestResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  unprocessableResponse,
  tooManyRequestsResponse,
  internalErrorResponse,
} from './response';
export type { SuccessResponse, ErrorResponse } from './response';

// Validation
export { validateBody, validateQuery, validateParams, validateHeaders } from './validation';

// Pagination
export { parsePaginationParams, buildPaginationMeta, applyPagination } from './pagination';
export type { PaginationParams, PaginationMeta } from './pagination';

// Auth Context
export {
  requireAuth,
  requireRole,
  requireAdmin,
  requireVendor,
  getVendorIfExists,
  requireOwnership,
} from './auth';
