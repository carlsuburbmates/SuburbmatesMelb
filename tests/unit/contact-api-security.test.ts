import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { sendEmail } from '@/lib/email';

// Mock sendEmail
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock Supabase
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

describe('Contact API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DISABLE_DB_INSERT = 'true';
  });

  it('sanitizes inputs in email body to prevent XSS', async () => {
    const maliciousInput = {
      name: '<script>alert("XSS")</script>',
      email: 'attacker@example.com',
      subject: 'Innocent Subject',
      message: '<h1>Heading</h1><img src=x onerror=alert(1)>',
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCall = vi.mocked(sendEmail).mock.calls[0][0];

    // Verify sanitization
    // The name should be escaped
    expect(emailCall.html).not.toContain('<script>');
    expect(emailCall.html).toContain('&lt;script&gt;');

    // The message should be escaped
    expect(emailCall.html).not.toContain('<h1>Heading</h1>');
    expect(emailCall.html).toContain('&lt;h1&gt;Heading&lt;/h1&gt;');
    expect(emailCall.html).not.toContain('<img src=x onerror=alert(1)>');
  });

  it('strips newlines from subject to prevent header injection', async () => {
     const maliciousInput = {
      name: 'Safe Name',
      email: 'safe@example.com',
      subject: 'Subject\nBcc: victim@example.com',
      message: 'Safe Message',
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCall = vi.mocked(sendEmail).mock.calls[0][0];

    // Check subject for newlines
    expect(emailCall.subject).not.toContain('\n');
    expect(emailCall.subject).toContain('[Contact Form] Subject Bcc: victim@example.com');
  });
});
