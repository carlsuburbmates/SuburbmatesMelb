import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
  supabase: {},
}));

vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock middleware to pass through the handler
vi.mock('@/middleware/rateLimit', () => ({
  withApiRateLimit: (handler: unknown) => handler,
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@/lib/constants', () => ({
  PLATFORM: {
    SUPPORT_EMAIL: 'support@example.com',
  },
}));

describe('Contact API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process valid submission and sanitize inputs', async () => {
    const body = {
      name: '<script>alert("name")</script>',
      email: 'test@example.com',
      subject: 'Test Subject <&>',
      message: 'Test Message\nSecond Line',
    };

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify DB insert
    const { supabaseAdmin } = await import('@/lib/supabase');
    expect(supabaseAdmin.from).toHaveBeenCalledWith('contact_submissions');

    // Verify Email sending with SANITIZED content
    const { sendEmail } = await import('@/lib/email');
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailArgs = vi.mocked(sendEmail).mock.calls[0][0];

    // Check HTML content for escaping
    // <script> becomes &lt;script&gt;
    // " becomes &quot;
    expect(emailArgs.html).toContain('&lt;script&gt;alert(&quot;name&quot;)&lt;/script&gt;');
    // <&> becomes &lt;&amp;&gt;
    expect(emailArgs.html).toContain('Test Subject &lt;&amp;&gt;');
    // \n becomes <br>
    expect(emailArgs.html).toContain('Test Message<br>Second Line');
  });

  it('should reject invalid email', async () => {
    const body = {
      name: 'John',
      email: 'invalid-email',
      subject: 'Hi',
      message: 'Hello',
    };

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
