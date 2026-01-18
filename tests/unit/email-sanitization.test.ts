import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendWelcomeEmail, sendVendorWarningEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/utils';

// Mock Resend
const { mockSend } = vi.hoisted(() => {
  return { mockSend: vi.fn() };
});

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: mockSend,
      };
    },
  };
});

// Mock environment variables
const originalEnv = process.env;

describe('Email Sanitization', () => {
  beforeEach(() => {
    vi.resetModules();
    mockSend.mockReset();
    mockSend.mockResolvedValue({ data: { id: 'test-id' }, error: null });
    process.env = { ...originalEnv, RESEND_API_KEY: 'test-key', DISABLE_RATE_LIMIT: 'false' };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('secure: sendWelcomeEmail escapes user input in email body', async () => {
    const maliciousName = '<script>alert("xss")</script>';
    await sendWelcomeEmail('test@example.com', maliciousName);

    expect(mockSend).toHaveBeenCalled();
    const callArgs = mockSend.mock.calls[0][0];

    // Should NOT contain the raw malicious string
    expect(callArgs.html).not.toContain(maliciousName);

    // Should contain the escaped version
    const expected = escapeHtml(maliciousName);
    expect(callArgs.html).toContain(expected);
  });

  it('secure: sendVendorWarningEmail escapes user input', async () => {
    const maliciousBusinessName = '<b>Bold Business</b>';
    const maliciousReason = '<img src=x onerror=alert(1)>';

    await sendVendorWarningEmail('vendor@example.com', maliciousBusinessName, maliciousReason);

    expect(mockSend).toHaveBeenCalled();
    const callArgs = mockSend.mock.calls[0][0];

    expect(callArgs.html).not.toContain(maliciousBusinessName);
    expect(callArgs.html).toContain(escapeHtml(maliciousBusinessName));

    expect(callArgs.html).not.toContain(maliciousReason);
    expect(callArgs.html).toContain(escapeHtml(maliciousReason));
  });
});
