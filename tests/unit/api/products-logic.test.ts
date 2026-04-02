import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsHandler } from '@/app/api/products/products.logic';
import { NextRequest } from 'next/server';
import { ValidationError, DatabaseError } from '@/lib/errors';

const mocks = vi.hoisted(() => {
  const select = vi.fn();
  const eq = vi.fn();
  const is = vi.fn();
  const order = vi.fn();
  const limit = vi.fn();
  const from = vi.fn();

  const chain = {
    select,
    eq,
    is,
    order,
    limit,
  };

  // Wire up chain
  from.mockReturnValue(chain);
  select.mockReturnValue(chain);
  eq.mockReturnValue(chain);
  is.mockReturnValue(chain);
  order.mockReturnValue(chain);
  // limit is the end of our chain in this case

  return {
    from,
    select,
    eq,
    is,
    order,
    limit,
  };
});

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: mocks.from,
  },
}));

describe('productsHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default chain behavior
    mocks.from.mockReturnValue(mocks); // Re-return the bag of mocks to simulate chaining
    mocks.select.mockReturnValue(mocks);
    mocks.eq.mockReturnValue(mocks);
    mocks.is.mockReturnValue(mocks);
    mocks.order.mockReturnValue(mocks);
  });

  it('should return products when valid request', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Product 1',
        description: 'Desc',
        price: 100,
        category: 'Cat',
        slug: 'slug-1',
        thumbnail_url: 'url',
        images: ['img1'],
        created_at: '2023-01-01',
      },
    ];
    mocks.limit.mockResolvedValueOnce({ data: mockProducts, error: null });

    const vendorId = '123e4567-e89b-12d3-a456-426614174000';
    const req = new NextRequest(`http://localhost/api/products?vendor_id=${vendorId}`);

    const response = await productsHandler(req);
    const data = await response.json();

    expect(data.products).toHaveLength(1);
    expect(data.products[0].id).toBe('1');
    expect(mocks.from).toHaveBeenCalledWith('products');
    expect(mocks.eq).toHaveBeenCalledWith('vendor_id', vendorId);
    expect(mocks.limit).toHaveBeenCalledWith(10); // Default limit
  });

  it('should throw ValidationError if vendor_id is invalid', async () => {
    const req = new NextRequest('http://localhost/api/products?vendor_id=invalid');

    await expect(productsHandler(req)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if limit is too high', async () => {
    const vendorId = '123e4567-e89b-12d3-a456-426614174000';
    const req = new NextRequest(`http://localhost/api/products?vendor_id=${vendorId}&limit=101`);

    await expect(productsHandler(req)).rejects.toThrow(ValidationError);
  });

  it('should respect custom limit', async () => {
    mocks.limit.mockResolvedValueOnce({ data: [], error: null });
    const vendorId = '123e4567-e89b-12d3-a456-426614174000';
    const req = new NextRequest(`http://localhost/api/products?vendor_id=${vendorId}&limit=50`);

    await productsHandler(req);

    expect(mocks.limit).toHaveBeenCalledWith(50);
  });

  it('should throw DatabaseError on supabase error', async () => {
    mocks.limit.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });
    const vendorId = '123e4567-e89b-12d3-a456-426614174000';
    const req = new NextRequest(`http://localhost/api/products?vendor_id=${vendorId}`);

    await expect(productsHandler(req)).rejects.toThrow(DatabaseError);
  });
});
