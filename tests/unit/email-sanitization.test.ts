import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('Email Sanitization (escapeHtml)', () => {
  it('should escape basic HTML characters', () => {
    const input = '<script>alert("xss")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should escape ampersands', () => {
    const input = 'Tom & Jerry';
    const expected = 'Tom &amp; Jerry';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should escape single and double quotes', () => {
    const input = `'test' "test"`;
    const expected = '&#039;test&#039; &quot;test&quot;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle strings with no special characters', () => {
    const input = 'Hello World';
    expect(escapeHtml(input)).toBe(input);
  });
});
