import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../src/app/api/contact/route';
import * as emailLib from '../../src/lib/email';

// Mock the sendEmail function
vi.mock('../../src/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true })
}));

// Mock the database
vi.mock('../../src/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null })
    })
  },
  supabase: {}
}));

describe('Contact API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sanitizes user inputs to prevent XSS and Header Injection', async () => {
    const maliciousPayload = {
      name: '<script>alert("name")</script>',
      email: 'test@example.com',
      subject: 'Urgent\r\nBcc: hacker@example.com',
      message: 'Hello <img src="x" onerror="alert(1)">\nNext line'
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(maliciousPayload)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);

    // Verify the email service was called with sanitized payload
    expect(emailLib.sendEmail).toHaveBeenCalledTimes(1);
    const emailArgs = vi.mocked(emailLib.sendEmail).mock.calls[0][0];

    // Subject should be sanitized (newlines stripped)
    expect(emailArgs.subject).toBe('[Contact Form] Urgent Bcc: hacker@example.com');

    // HTML body should have escaped HTML entities for XSS protection
    expect(emailArgs.html).toContain('&lt;script&gt;alert(&quot;name&quot;)&lt;/script&gt;');
    expect(emailArgs.html).toContain('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;<br>Next line');
  });
});
