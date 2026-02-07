import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock dependencies
const sendEmailMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/email', () => ({
  sendEmail: sendEmailMock,
}));

const insertMock = vi.hoisted(() => vi.fn());
const fromMock = vi.hoisted(() => vi.fn(() => ({ insert: insertMock })));
vi.mock('@/lib/supabase', () => ({
  supabase: { from: fromMock },
  supabaseAdmin: { from: fromMock },
}));

describe('Contact API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    insertMock.mockReturnValue({ error: null });
    sendEmailMock.mockResolvedValue({ success: true });
  });

  it('should sanitize input to prevent XSS in email', async () => {
    const maliciousInput = {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com',
      subject: 'Hello <img src=x onerror=alert(1)>',
      message: 'This is a message with <b>bold</b> and <script>bad</script>',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    // Verify email content is sanitized
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailOptions = sendEmailMock.mock.calls[0][0];

    // Check subject
    expect(emailOptions.subject).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(emailOptions.subject).not.toContain('<img');

    // Check HTML body
    expect(emailOptions.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(emailOptions.html).toContain('&lt;script&gt;bad&lt;/script&gt;');
    expect(emailOptions.html).not.toContain('<script>');
  });

  it('should allow valid input', async () => {
    const validInput = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry',
      message: 'Hello, I have a question.',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(validInput),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailOptions = sendEmailMock.mock.calls[0][0];
    expect(emailOptions.subject).toContain('Inquiry');
    expect(emailOptions.html).toContain('John Doe');
  });
});
