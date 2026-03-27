import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('escapeHtml', () => {
  it('should escape special characters', () => {
    const input = '<script>alert("xss")</script> & \'';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#039;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should return the same string if no special characters are present', () => {
    const input = 'Hello World';
    expect(escapeHtml(input)).toBe(input);
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });
});
