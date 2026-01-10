
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/contact/route';

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

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

describe('Contact Form API - Security Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    console.log = vi.fn();
    // Enable DB insert mock
    process.env.DISABLE_DB_INSERT = 'false';
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  it('should escape HTML injection in email body', async () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: maliciousInput,
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    });

    await POST(request);

    const sendEmailMock = await import('@/lib/email').then(m => m.sendEmail);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailCall = (sendEmailMock as any).mock.calls[0][0];
    const htmlBody = emailCall.html;

    // The vulnerability check: Input should NOT be directly present
    expect(htmlBody).not.toContain(maliciousInput);

    // The fix check: Input should be escaped
    expect(htmlBody).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });
});
