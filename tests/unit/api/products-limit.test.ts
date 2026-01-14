import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock Supabase client
const limitSpy = vi.fn();
const orderSpy = vi.fn().mockReturnThis();
const isSpy = vi.fn().mockReturnThis();
const eqSpy = vi.fn().mockReturnThis();
const selectSpy = vi.fn().mockReturnThis();
const fromSpy = vi.fn().mockReturnValue({
  select: selectSpy,
  eq: eqSpy,
  is: isSpy,
  order: orderSpy,
  limit: limitSpy,
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: fromSpy,
  })),
}));

describe('Products API Limit Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default return values
    limitSpy.mockResolvedValue({ data: [], error: null });
    // Reset modules to allow re-importing if needed, but vitest doesn't easily un-import.
    // However, for this test, we just run it once.
  });

  it('caps limit at 100 when user requests more', async () => {
    // Import the module under test
    // We use a query param limit=150
    const req = new NextRequest('http://localhost:3000/api/products?vendor_id=123&limit=150');

    // Dynamic import to ensure mocks are applied
    const { getProducts } = await import('@/app/api/products/products.logic');

    await getProducts(req);

    // Verify limit was called with 100
    // This expects the FIX to be in place.
    // Currently, it will fail (it will be called with 150).
    expect(limitSpy).toHaveBeenCalledWith(100);
  });

  it('uses provided limit if less than 100', async () => {
     const req = new NextRequest('http://localhost:3000/api/products?vendor_id=123&limit=50');
     const { getProducts } = await import('@/app/api/products/products.logic');
     await getProducts(req);
     expect(limitSpy).toHaveBeenCalledWith(50);
  });
});
