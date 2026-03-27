import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock the email library
const sendEmailMock = vi.fn().mockResolvedValue({ success: true });

vi.mock('@/lib/email', () => ({
  sendEmail: (...args: unknown[]) => sendEmailMock(...args),
}));

describe('Contact API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DISABLE_DB_INSERT = 'true';
  });

  it('should be vulnerable to XSS if input is not sanitized', async () => {
    const maliciousPayload = {
      name: 'Bad Actor',
      email: 'hacker@example.com',
      subject: 'Important Update',
      message: '<script>alert("XSS")</script>'
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify that sendEmail was called with the SANITIZED payload
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailArgs = sendEmailMock.mock.calls[0][0];

    // Check HTML content contains the sanitized script tag
    expect(emailArgs.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(emailArgs.html).not.toContain('<script>');
  });

  it('should be protected against header injection in subject', async () => {
     const maliciousPayload = {
      name: 'Bad Actor',
      email: 'hacker@example.com',
      subject: 'Important\nBcc: victim@example.com',
      message: 'Hello'
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });

    await POST(req);

    const emailArgs = sendEmailMock.mock.calls[0][0];
    // This confirms the subject is sanitized (newlines removed)
    expect(emailArgs.subject).toContain('Important Bcc: victim@example.com');
    expect(emailArgs.subject).not.toContain('\n');
  });
});
