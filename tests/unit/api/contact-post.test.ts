import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Hoist mocks
const mocks = vi.hoisted(() => {
  return {
    sendEmail: vi.fn(),
    dbFrom: vi.fn(),
    dbInsert: vi.fn(),
  };
});

vi.mock('@/lib/email', () => ({
  sendEmail: mocks.sendEmail,
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: mocks.dbFrom,
  },
  supabase: {
    from: mocks.dbFrom,
  },
}));

vi.mock('@/lib/constants', () => ({
  PLATFORM: { SUPPORT_EMAIL: 'support@example.com' },
}));

import { POST } from '@/app/api/contact/route';

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.dbFrom.mockReturnValue({ insert: mocks.dbInsert });
    mocks.dbInsert.mockResolvedValue({ error: null });
    mocks.sendEmail.mockResolvedValue({ success: true });
  });

  it('should sanitize HTML inputs in email body', async () => {
    const body = {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com',
      subject: '<b>Bold Subject</b>',
      message: 'Hello <br> World',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Verify sendEmail was called
    expect(mocks.sendEmail).toHaveBeenCalled();
    const callArgs = mocks.sendEmail.mock.calls[0][0];

    // Check HTML sanitization
    expect(callArgs.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(callArgs.html).toContain('&lt;b&gt;Bold Subject&lt;/b&gt;');
    expect(callArgs.html).toContain('Hello &lt;br&gt; World');
  });

  it('should escape newlines correctly', async () => {
    const body = {
        name: 'John',
        email: 'john@example.com',
        subject: 'Sub',
        message: 'Line 1\nLine 2',
      };

      const req = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      await POST(req);

      expect(mocks.sendEmail).toHaveBeenCalled();
      const callArgs = mocks.sendEmail.mock.calls[0][0];
      expect(callArgs.html).toContain('Line 1<br>Line 2');
  });
});
