import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { sendEmail } from '@/lib/email';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  },
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  },
}));

vi.mock('@/middleware', async (importOriginal) => {
    // Just pass through the handler for testing logic, ignoring rate limit
    return {
        ...await importOriginal<typeof import('@/middleware')>(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        withApiRateLimit: (handler: any) => handler,
    }
});

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
  logSecurityEvent: vi.fn(),
  SecurityEvent: { RATE_LIMIT_EXCEEDED: 'security.rate_limit_exceeded' },
}));


describe('Contact API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sanitizes HTML input in emails', async () => {
    const maliciousInput = {
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      subject: 'Hello <b>World</b>',
      message: 'Click <a href="http://evil.com">here</a>',
    };

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    await POST(req);

    expect(sendEmail).toHaveBeenCalled();
    const callArgs = vi.mocked(sendEmail).mock.calls[0][0];

    // Check that tags are escaped in the HTML part
    expect(callArgs.html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(callArgs.html).toContain('Hello &lt;b&gt;World&lt;/b&gt;');
    expect(callArgs.html).toContain('Click &lt;a href=&quot;http://evil.com&quot;&gt;here&lt;/a&gt;');
  });
});
