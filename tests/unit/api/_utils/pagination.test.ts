import { describe, it, expect } from 'vitest';
import { buildPaginationMeta } from '@/app/api/_utils/pagination';

describe('buildPaginationMeta', () => {
  it('should calculate correct metadata for standard case', () => {
    // 50 items, 10 per page, page 2
    // total pages: 5
    // hasNext: true, hasPrev: true
    const meta = buildPaginationMeta(2, 10, 50);
    expect(meta).toEqual({
      page: 2,
      limit: 10,
      totalItems: 50,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: true,
      nextPage: 3,
      previousPage: 1,
    });
  });

  it('should handle first page correctly', () => {
    // 50 items, 10 per page, page 1
    const meta = buildPaginationMeta(1, 10, 50);
    expect(meta).toEqual({
      page: 1,
      limit: 10,
      totalItems: 50,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
      nextPage: 2,
      previousPage: null,
    });
  });

  it('should handle last page correctly', () => {
    // 50 items, 10 per page, page 5
    const meta = buildPaginationMeta(5, 10, 50);
    expect(meta).toEqual({
      page: 5,
      limit: 10,
      totalItems: 50,
      totalPages: 5,
      hasNextPage: false,
      hasPreviousPage: true,
      nextPage: null,
      previousPage: 4,
    });
  });

  it('should handle single page correctly', () => {
    // 5 items, 10 per page, page 1
    const meta = buildPaginationMeta(1, 10, 5);
    expect(meta).toEqual({
      page: 1,
      limit: 10,
      totalItems: 5,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null,
    });
  });

  it('should handle empty items correctly', () => {
    // 0 items, 10 per page, page 1
    const meta = buildPaginationMeta(1, 10, 0);
    expect(meta).toEqual({
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null,
    });
  });
});
