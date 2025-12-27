/**
 * SuburbMates V1.1 - Pagination Utilities
 * Helper functions for paginated API responses
 */

import { NextRequest } from 'next/server';
import { PAGINATION } from '@/lib/constants';

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

// ============================================================================
// PAGINATION FUNCTIONS
// ============================================================================

/**
 * Parse pagination parameters from request
 */
export function parsePaginationParams(req: NextRequest): PaginationParams {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    PAGINATION.MAX_PAGE_SIZE,
    Math.max(
      PAGINATION.MIN_PAGE_SIZE,
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_PAGE_SIZE), 10)
    )
  );

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build pagination response metadata
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };
}

/**
 * Apply pagination to Supabase query
 */
type RangeCapableQuery<T> = {
  range?: (from: number, to: number) => T;
};

export function applyPagination<T extends RangeCapableQuery<T>>(
  query: T,
  pagination: PaginationParams
): T {
  const { offset, limit } = pagination;
  if (typeof query.range === 'function') {
    return query.range(offset, offset + limit - 1);
  }
  return query;
}
