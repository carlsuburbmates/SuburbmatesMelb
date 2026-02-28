import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../src/app/api/contact/route';
import { sendEmail } from '../../src/lib/email';

// Mock dependencies
vi.mock('../../src/lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('../../src/lib/supabase', () => ({
  supabaseAdmin: null,
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  },
}));

// Mock console methods to avoid cluttering test output
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Contact API Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (body: Record<string, unknown>) => {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as Request;
  };

  it('should sanitize HTML inputs to prevent XSS in email bodies', async () => {
    const maliciousInput = {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com',
      subject: 'Hello <img src=x onerror=alert(1)>',
      message: 'This is a message with <b>bold</b> and <script>alert(2)</script>',
    };

    const request = createMockRequest(maliciousInput);
    const response = await POST(request);

    expect(response.status).toBe(200);

    // Verify sendEmail was called with sanitized HTML
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCallArgs = vi.mocked(sendEmail).mock.calls[0][0];

    // Name should be escaped
    expect(emailCallArgs.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(emailCallArgs.html).not.toContain('<script>alert("XSS")</script>');

    // Subject should be escaped in HTML body
    expect(emailCallArgs.html).toContain('Hello &lt;img src=x onerror=alert(1)&gt;');
    expect(emailCallArgs.html).not.toContain('Hello <img src=x onerror=alert(1)>');

    // Message should be escaped in HTML body
    expect(emailCallArgs.html).toContain('This is a message with &lt;b&gt;bold&lt;/b&gt; and &lt;script&gt;alert(2)&lt;/script&gt;');
    expect(emailCallArgs.html).not.toContain('<b>bold</b>');
    expect(emailCallArgs.html).not.toContain('<script>alert(2)</script>');
  });

  it('should strip newlines from subject to prevent Header Injection', async () => {
    const maliciousInput = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Innocent Subject\r\nBcc: attacker@example.com\r\nSubject: You have been hacked',
      message: 'This is a test message.',
    };

    const request = createMockRequest(maliciousInput);
    const response = await POST(request);

    expect(response.status).toBe(200);

    // Verify sendEmail was called with sanitized subject header
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCallArgs = vi.mocked(sendEmail).mock.calls[0][0];

    // The subject passed to the email sender should have newlines stripped
    expect(emailCallArgs.subject).toBe('[Contact Form] Innocent Subject Bcc: attacker@example.com Subject: You have been hacked');
    expect(emailCallArgs.subject).not.toContain('\r\n');
    expect(emailCallArgs.subject).not.toContain('\n');
  });

  it('should preserve newlines in message body but escape HTML', async () => {
    const inputWithNewlines = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Line 1\nLine 2\r\nLine 3 <script>alert(1)</script>',
    };

    const request = createMockRequest(inputWithNewlines);
    const response = await POST(request);

    expect(response.status).toBe(200);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    const emailCallArgs = vi.mocked(sendEmail).mock.calls[0][0];

    // The message body HTML should convert \n to <br> and escape the script tag
    expect(emailCallArgs.html).toContain('Line 1<br>Line 2\r<br>Line 3 &lt;script&gt;alert(1)&lt;/script&gt;');
  });
});
