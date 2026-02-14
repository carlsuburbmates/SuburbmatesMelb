
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { sendEmail } from '@/lib/email';

// Mock the email module
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock Supabase to avoid DB calls
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

describe('Contact API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize HTML in contact form inputs to prevent XSS', async () => {
    const maliciousInput = {
      name: '<script>alert("XSS")</script>',
      email: 'hacker@example.com',
      subject: '<b>Important</b>',
      message: '<img src=x onerror=alert(1)>',
    };

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousInput),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailOptions = vi.mocked(sendEmail).mock.calls[0][0];

    // Check that the HTML content is sanitized
    expect(emailOptions.html).not.toContain('<script>');
    expect(emailOptions.html).toContain('&lt;script&gt;');
    expect(emailOptions.html).not.toContain('<img src=x');
    expect(emailOptions.html).toContain('&lt;img src=x');

    // Check subject in HTML body is sanitized
    expect(emailOptions.html).toContain('&lt;b&gt;Important&lt;/b&gt;');
  });
});
