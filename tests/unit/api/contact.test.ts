import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
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

vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Contact API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize input in email html', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: xssPayload,
    };

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCall = vi.mocked(sendEmail).mock.calls[0][0];

    // Check HTML content for escaped characters
    // The escapeHtml function replaces " with &quot;
    expect(emailCall.html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(emailCall.html).not.toContain('<script>');
  });

  it('should allow valid input', async () => {
    const body = {
      name: 'Valid User',
      email: 'valid@example.com',
      subject: 'Hello',
      message: 'This is a message.',
    };

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('should validate input', async () => {
     const body = {
      name: '', // Invalid
      email: 'not-an-email',
      subject: '',
      message: '',
    };

    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
