import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Hoist mocks using vi.hoisted
const { mockFrom, mockSelect, mockEq, mockLimit, mockIs, mockOrder } = vi.hoisted(() => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockIs = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockLimit = vi.fn().mockReturnThis();
  const mockFrom = vi.fn().mockReturnValue({
    select: mockSelect,
  });

  // Chain setup
  mockSelect.mockReturnValue({ eq: mockEq });
  mockEq.mockReturnValue({ eq: mockEq, is: mockIs });
  mockIs.mockReturnValue({ order: mockOrder });
  mockOrder.mockReturnValue({ limit: mockLimit });

  return { mockFrom, mockSelect, mockEq, mockLimit, mockIs, mockOrder };
});

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: mockFrom,
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock middleware
vi.mock('@/middleware', () => ({
  withApiRateLimit: (handler) => handler,
  withLogging: (handler) => handler,
  withErrorHandler: (handler) => handler,
  withCors: (handler) => handler,
}));

// Import after mocks
import { GET } from '@/app/api/products/route';

describe('API Products Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset chain
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ eq: mockEq, is: mockIs }); // chained calls
    // Note: Since eq returns self, we need to handle the chain properly if it's called multiple times.
    // But since it's a mockReturnThis() style (simulated), we just need to make sure the last one returns an object with next methods.

    // Re-setup the chain for the specific test flow
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ eq: mockEq, is: mockIs });
    mockIs.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit });
  });

  it('should return 400 if vendor_id is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/products');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Vendor ID is required');
  });

  it('should return products on success', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Product 1',
        description: 'Desc 1',
        price: 1000,
        category: 'Art',
        slug: 'p1',
        thumbnail_url: 'http://img.com/1.jpg',
        images: ['http://img.com/1.jpg'],
        created_at: '2023-01-01',
      },
    ];

    mockLimit.mockResolvedValueOnce({ data: mockProducts, error: null });

    const req = new NextRequest('http://localhost:3000/api/products?vendor_id=v1');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.products).toHaveLength(1);
    expect(data.products[0].title).toBe('Product 1');
    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(mockEq).toHaveBeenCalledWith('vendor_id', 'v1');
  });

  it('should handle database errors', async () => {
    mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });

    const req = new NextRequest('http://localhost:3000/api/products?vendor_id=v1');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to fetch products');
  });
});
