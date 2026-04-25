import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://dummy.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-key';
});

// Hoist mocks manually if needed, but vitest hoists vi.mock automatically.
// The issue is that the factory function cannot reference variables outside of it.
// We must return the mocks from the factory.

const { mockFrom, mockSelect, mockEq, mockSingle, mockMaybeSingle } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn().mockReturnValue({
    eq: vi.fn(),
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
  });
  const mockSelect = vi.fn().mockReturnValue({
    eq: mockEq,
  });
  const mockFrom = vi.fn().mockReturnValue({
    select: mockSelect,
  });

  // Make sure eq returns itself to handle chained .eq().eq()
  // But we will override implementation in tests anyway.

  return { mockFrom, mockSelect, mockEq, mockSingle, mockMaybeSingle };
});

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: mockFrom,
    }),
  };
});

// Import the module AFTER defining mocks
import { GET } from '@/app/api/creator/[slug]/route';

describe('GET /api/business/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock chain behavior
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ eq: mockEq, single: mockSingle, maybeSingle: mockMaybeSingle });
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
  });

  it('should return business with images', async () => {
    // Setup specific mock return values for this test
    mockFrom.mockImplementation((table) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      };

      if (table === 'business_profiles') {
        chain.single.mockResolvedValue({
          data: {
            id: '123',
            business_name: 'Test Business',
            profile_description: 'Test Description',
            slug: 'test-business',
            is_public: true,
            created_at: new Date().toISOString(),
            user_id: 'user-123',
            category_id: 3,
            vendor_status: 'active',
            images: ['img1.jpg', 'img2.jpg']
          },
          error: null
        });
      } else if (table === 'users') {
        chain.single.mockResolvedValue({
            data: { email: 'test@example.com' },
            error: null
        });
      } else if (table === 'vendors') {
        chain.maybeSingle.mockResolvedValue({
          data: { id: 'vendor-123', product_count: 2, primary_region_id: 17 },
          error: null,
        });
      } else if (table === 'regions') {
        chain.single.mockResolvedValue({
          data: { name: 'Eastern' },
          error: null,
        });
      } else if (table === 'categories') {
        chain.single.mockResolvedValue({
          data: { name: 'Design' },
          error: null,
        });
      } else {
        chain.single.mockResolvedValue({ data: null, error: null });
        chain.maybeSingle.mockResolvedValue({ data: null, error: null });
      }

      return chain;
    });

    const request = new NextRequest('http://localhost:3000/api/creator/test-business');
    const params = Promise.resolve({ slug: 'test-business' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.business).toBeDefined();
    expect(data.business.name).toBe('Test Business');
    expect(data.business.region).toBe('Eastern');
    expect(data.business.category).toBe('Design');
    expect(data.business.vendorId).toBe('vendor-123');
    expect(data.business.images).toHaveLength(2);
    expect(data.business.images).toEqual(['img1.jpg', 'img2.jpg']);
  });

  it('should return empty images array if images is null', async () => {
    // Override mock for this specific test
    mockFrom.mockImplementation((table) => {
        const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(),
            maybeSingle: vi.fn(),
          };

          if (table === 'business_profiles') {
            chain.single.mockResolvedValue({
              data: {
                id: '123',
                business_name: 'Test Business',
                slug: 'test-business',
                is_public: true,
                vendor_status: 'active',
                images: null // null images
              },
              error: null
            });
          } else {
            chain.single.mockResolvedValue({ data: null, error: null });
            chain.maybeSingle.mockResolvedValue({ data: null, error: null });
          }

          return chain;
    });

    const request = new NextRequest('http://localhost:3000/api/creator/test-business');
    const params = Promise.resolve({ slug: 'test-business' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.business.images).toEqual([]);
  });
});
