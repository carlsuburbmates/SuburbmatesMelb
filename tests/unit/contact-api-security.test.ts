import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// 1. Hoist the mock function so it's available inside vi.mock
const sendEmailMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true }));

// 2. Mock the modules
vi.mock('@/lib/email', () => ({
  sendEmail: sendEmailMock,
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

// 3. Import the module under test AFTER mocking
import { POST } from '@/app/api/contact/route';

// Set environment variable to skip DB insert logic if needed
process.env.DISABLE_DB_INSERT = 'true';

describe('Contact API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize XSS payloads in name, email, subject, and message', async () => {
    const maliciousPayload = {
      name: '<script>alert("XSS")</script>',
      email: 'hacker@example.com',
      subject: 'Subject <img src=x onerror=alert(1)>',
      message: 'Hello <script>bad()</script>\nWorld',
    };

    // Need to use a URL that parses correctly
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailOptions = sendEmailMock.mock.calls[0][0];

    // Verify HTML content is sanitized
    expect(emailOptions.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'); // Name
    expect(emailOptions.html).toContain('hacker@example.com');

    // Subject in HTML body should be escaped
    expect(emailOptions.html).toContain('Subject &lt;img src=x onerror=alert(1)&gt;');

    // Message should be escaped AND newlines converted to <br>
    expect(emailOptions.html).toContain('Hello &lt;script&gt;bad()&lt;/script&gt;<br>World');
  });

  it('should strip newlines from subject header to prevent injection', async () => {
    const maliciousPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Normal Subject\nBcc: victim@example.com',
      message: 'Just a message',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailOptions = sendEmailMock.mock.calls[0][0];

    // Subject header should have newlines removed/replaced
    expect(emailOptions.subject).toBe('[Contact Form] Normal Subject Bcc: victim@example.com');
  });
});
