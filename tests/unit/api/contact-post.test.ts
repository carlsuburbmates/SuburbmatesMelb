import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { sendEmail } from '@/lib/email';

// Mock sendEmail
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock supabase modules
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {},
  supabase: {},
}));

// Mock constants
vi.mock('@/lib/constants', () => ({
  PLATFORM: {
    SUPPORT_EMAIL: 'support@example.com',
  },
}));

describe('Contact Form API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, DISABLE_DB_INSERT: 'true' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should sanitize HTML input in email body', async () => {
    const maliciousInput = {
      name: '<script>alert("name")</script>',
      email: 'test@example.com',
      subject: '<b>Bold Subject</b>',
      message: 'Hello\n<img src=x onerror=alert(1)>',
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    // Verify sendEmail was called
    expect(sendEmail).toHaveBeenCalledTimes(1);

    const emailCallArgs = vi.mocked(sendEmail).mock.calls[0][0];
    const htmlBody = emailCallArgs.html;

    // Assert sanitization
    // Name
    expect(htmlBody).toContain('&lt;script&gt;alert(&quot;name&quot;)&lt;/script&gt;');
    // Subject (in body)
    expect(htmlBody).toContain('&lt;b&gt;Bold Subject&lt;/b&gt;');
    // Message
    expect(htmlBody).toContain('&lt;img src=x onerror=alert(1)&gt;');
    // Newlines converted to <br> after escaping
    expect(htmlBody).toContain('Hello<br>&lt;img');

    // Ensure raw HTML is NOT present
    expect(htmlBody).not.toContain('<script>');
    expect(htmlBody).not.toContain('<b>Bold Subject</b>');
    expect(htmlBody).not.toContain('<img src=x');
  });

  it('should handle normal input correctly', async () => {
    const normalInput = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a\nmessage.',
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(normalInput),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const emailCallArgs = vi.mocked(sendEmail).mock.calls[0][0];
    const htmlBody = emailCallArgs.html;

    expect(htmlBody).toContain('John Doe');
    expect(htmlBody).toContain('Hello');
    expect(htmlBody).toContain('This is a<br>message.');
  });
});
