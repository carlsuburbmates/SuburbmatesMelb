import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Hoist mocks
const { mockFrom, mockInsert, mockSingle } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockInsert = vi.fn();
  const mockFrom = vi.fn();

  return { mockFrom, mockInsert, mockSingle };
});

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: mockFrom,
    }),
  };
});

// Mock auth
vi.mock('@/app/api/_utils/auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    user: { id: 'user-123' },
    dbClient: {
      from: mockFrom,
    },
  }),
}));

// Mock slug utils
vi.mock('@/lib/slug-utils', () => ({
  generateUniqueBusinessSlug: vi.fn().mockResolvedValue('sanitized-business'),
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

import { POST } from '@/app/api/business/route';

describe('POST /api/business - Sanitization', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
            single: mockSingle
        })
    });

    // Default mock implementation
    mockFrom.mockImplementation((table) => {
      if (table === 'business_profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), // No existing profile
            }),
          }),
          insert: mockInsert,
        };
      }
      if (table === 'vendors') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), // No vendor
            }),
          }),
        };
      }
      return { select: vi.fn(), insert: vi.fn() };
    });
  });

  it('should strip HTML tags from business_name and profile_description', async () => {
    mockSingle.mockResolvedValue({ data: { id: 'new-id' }, error: null });

    const body = {
      business_name: '<script>alert("xss")</script>My Business',
      profile_description: '<b>Bold</b> Description',
      suburb_id: 1,
      category_id: 2
    };

    const request = new NextRequest('http://localhost:3000/api/business', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    await response.json();

    expect(response.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      business_name: 'alert("xss")My Business',
      profile_description: 'Bold Description',
      suburb_id: 1,
      category_id: 2,
    }));
  });

  it('should return 400 if suburb_id is invalid', async () => {
    const body = {
      business_name: 'Valid Business',
      suburb_id: 'invalid',
    };

    const request = new NextRequest('http://localhost:3000/api/business', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid suburb_id');
  });

  it('should return 400 if category_id is invalid', async () => {
    const body = {
      business_name: 'Valid Business',
      category_id: 'invalid',
    };

    const request = new NextRequest('http://localhost:3000/api/business', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid category_id');
  });
});
