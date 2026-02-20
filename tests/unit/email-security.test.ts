import { describe, it, expect, vi, beforeEach } from 'vitest';

const { sendMock } = vi.hoisted(() => {
  return { sendMock: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }) };
});

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: sendMock,
      };
    },
  };
});

import { sendWelcomeEmail, sendVendorOnboardingEmail } from '@/lib/email';

describe('Email Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize first name in welcome email', async () => {
    const maliciousName = '<script>alert("XSS")</script>';
    const email = 'test@example.com';

    await sendWelcomeEmail(email, maliciousName);

    expect(sendMock).toHaveBeenCalled();
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.html).not.toContain('<script>');
    expect(callArgs.html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

  it('should sanitize business name and url in vendor onboarding email', async () => {
    const maliciousName = '<b>Evil Corp</b>';
    const maliciousUrl = 'http://evil.com?q="><script>alert(1)</script>';
    const email = 'vendor@example.com';

    await sendVendorOnboardingEmail(email, maliciousName, maliciousUrl);

    expect(sendMock).toHaveBeenCalled();
    const callArgs = sendMock.mock.calls[0][0];

    // Check Name
    expect(callArgs.html).not.toContain('<b>Evil Corp</b>');
    expect(callArgs.html).toContain('&lt;b&gt;Evil Corp&lt;/b&gt;');

    // Check URL
    expect(callArgs.html).toContain(
      'href="http://evil.com?q=&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"'
    );
  });
});
