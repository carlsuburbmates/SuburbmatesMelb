import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { sendEmail } from '@/lib/email';

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  },
  supabaseAdmin: null,
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

describe('Contact API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('DISABLE_DB_INSERT', 'false');
  });

  it('should sanitize malicious input in email body (prevention of XSS)', async () => {
    const maliciousInput = {
      name: 'Hacker',
      email: 'hacker@example.com',
      subject: 'XSS Attack',
      message: '<script>alert("xss")</script><b>Bold</b>',
    };

    const request = {
      json: async () => maliciousInput,
    } as Request;

    const response = await POST(request);

    // Check response success
    expect(response.status).toBe(200);

    // Check sendEmail call
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCall = vi.mocked(sendEmail).mock.calls[0][0];
    const htmlContent = emailCall.html;

    console.log('Actual HTML content sent:', htmlContent);

    // VERIFICATION: We expect the script tag to be ESCAPED.
    expect(htmlContent).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');

    // It should NOT contain the raw script tag
    expect(htmlContent).not.toContain('<script>alert("xss")</script>');
  });
});
