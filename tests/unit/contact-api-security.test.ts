import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email';

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

// Import the route handler
import { POST } from '@/app/api/contact/route';

describe('POST /api/contact - Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize XSS payload in contact form submission', async () => {
    const maliciousPayload = {
      name: '<script>alert("XSS")</script>',
      email: 'attacker@example.com',
      subject: 'Injected <script> Header',
      message: 'Hello <img src=x onerror=alert(1)> World\nNew Line',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailOptions = vi.mocked(sendEmail).mock.calls[0][0];

    // Verify HTML content is sanitized
    expect(emailOptions.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(emailOptions.html).toContain('&lt;img src=x onerror=alert(1)&gt;');

    // Verify newlines are preserved as <br>
    expect(emailOptions.html).toContain('<br>');

    // Verify subject in HTML body is sanitized
    expect(emailOptions.html).toContain('Injected &lt;script&gt; Header');

    // Verify subject in header is stripped of newlines (if any were present, though strict test here assumes none)
    expect(emailOptions.subject).toBe('[Contact Form] Injected <script> Header');
    // Wait, my plan said stripNewlines for header.
    // If I use stripNewlines, <script> remains but newlines are gone.
    // If I use escapeHtml, <script> becomes &lt;script&gt;.
    // Email clients usually don't execute script in Subject header, but HTML injection in body is the main concern.
    // Let's verify what I implemented in the plan.
  });

  it('should strip newlines from subject header to prevent header injection', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello\nBcc: victim@example.com',
      message: 'Just a message',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    await POST(request);

    const emailOptions = vi.mocked(sendEmail).mock.calls[0][0];
    expect(emailOptions.subject).toBe('[Contact Form] Hello Bcc: victim@example.com');
  });
});
