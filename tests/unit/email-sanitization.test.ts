import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('escapeHtml', () => {
  it('should escape special HTML characters', () => {
    const input = '<script>alert("XSS")</script> & \'test\'';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; &#039;test&#039;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle strings without special characters', () => {
    const input = 'Hello World';
    expect(escapeHtml(input)).toBe(input);
  });

  it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
  });
});
