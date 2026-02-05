import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextResponse } from 'next/server';

// Mock dependencies
const mockSendEmail = vi.hoisted(() => vi.fn());

vi.mock('@/lib/email', () => ({
  sendEmail: mockSendEmail,
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  },
  supabase: {
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  },
}));

describe('Contact Form Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendEmail.mockResolvedValue({ success: true });
    // Disable DB insert for these tests to focus on email
    process.env.DISABLE_DB_INSERT = 'true';
  });

  it('should sanitize user input in HTML email (VULNERABILITY FIX VERIFICATION)', async () => {
    const maliciousInput = {
      name: 'Hacker',
      email: 'hacker@example.com',
      subject: 'Urgent',
      message: '<script>alert("XSS")</script>',
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    await POST(request);

    expect(mockSendEmail).toHaveBeenCalled();
    const emailCall = mockSendEmail.mock.calls[0][0];

    // This assertion confirms the vulnerability is FIXED:
    // The script tag should be escaped.
    expect(emailCall.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(emailCall.html).not.toContain('<script>alert("XSS")</script>');
  });
});
