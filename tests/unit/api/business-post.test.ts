import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Hoist mocks
const mocks = vi.hoisted(() => {
  return {
    requireAuth: vi.fn(),
    generateUniqueBusinessSlug: vi.fn(),
    dbFrom: vi.fn(),
    dbSelect: vi.fn(),
    dbEq: vi.fn(),
    dbMaybeSingle: vi.fn(),
    dbInsert: vi.fn(),
    dbSingle: vi.fn(),
  };
});

vi.mock('@/app/api/_utils/auth', () => ({
  requireAuth: mocks.requireAuth,
}));

vi.mock('@/lib/slug-utils', () => ({
  generateUniqueBusinessSlug: mocks.generateUniqueBusinessSlug,
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: mocks.dbFrom }),
}));

import { POST } from '@/app/api/business/route';

describe('POST /api/business', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup generic DB chain
    mocks.dbFrom.mockReturnValue({
      select: mocks.dbSelect,
      insert: mocks.dbInsert,
    });
    mocks.dbSelect.mockReturnValue({
      eq: mocks.dbEq,
      single: mocks.dbSingle,
    });
    mocks.dbEq.mockReturnValue({
      maybeSingle: mocks.dbMaybeSingle,
    });
    mocks.dbInsert.mockReturnValue({
      select: mocks.dbSelect,
    });

    // Default auth mock
    mocks.requireAuth.mockResolvedValue({
      user: { id: 'user-123' },
      dbClient: { from: mocks.dbFrom },
    });

    // Default slug mock
    mocks.generateUniqueBusinessSlug.mockResolvedValue('test-business');

    // Default DB responses
    // 1. Check existing profile -> null (no profile)
    mocks.dbMaybeSingle.mockResolvedValue({ data: null, error: null });

    // 2. Insert -> success
    mocks.dbSingle.mockResolvedValue({
      data: { id: 'biz-123', business_name: 'Sanitized' },
      error: null,
    });
  });

  it('should sanitize business_name and profile_description', async () => {
    const body = {
      business_name: '<b>Bold Business</b>',
      profile_description: '<script>alert("XSS")</script>Description',
      suburb_id: 'suburb-1',
      category_id: 'cat-1',
    };

    const req = new NextRequest('http://localhost:3000/api/business', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    // We need to handle the sequence of db calls.
    // 1. check existing profile (table: business_profiles)
    // 2. check vendor (table: vendors)
    // 3. insert profile (table: business_profiles)

    // Using mockImplementationOnce to handle sequence if needed, but generic might work if we verify calls.
    // However, maybeSingle is called twice. First for profile, second for vendor.

    mocks.dbMaybeSingle
        .mockResolvedValueOnce({ data: null, error: null }) // existing profile check
        .mockResolvedValueOnce({ data: null, error: null }); // vendor check

    const res = await POST(req);
    // const data = await res.json(); // Not needed

    expect(res.status).toBe(200);

    // Verify stripHtml was applied
    expect(mocks.dbInsert).toHaveBeenCalledWith(expect.objectContaining({
      business_name: 'Bold Business',
      profile_description: 'alert("XSS")Description',
    }));
  });

  it('should return error if sanitized business_name is empty', async () => {
    const body = {
      business_name: '<b></b>', // Sanitizes to empty string
      profile_description: 'Desc',
    };

    const req = new NextRequest('http://localhost:3000/api/business', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    // Mock db check existing profile
    mocks.dbMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Business name is required');

    // Should NOT insert
    expect(mocks.dbInsert).not.toHaveBeenCalled();
  });
});
