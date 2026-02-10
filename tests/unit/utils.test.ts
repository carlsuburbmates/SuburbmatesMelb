import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('escapeHtml', () => {
  it('should escape special characters', () => {
    const input = '<script>alert("XSS")</script> & \'';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; &#39;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should return the string as is if no special characters are present', () => {
    const input = 'Hello World';
    expect(escapeHtml(input)).toBe(input);
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle undefined or null input gracefully', () => {
    // @ts-expect-error - testing null
    expect(escapeHtml(null)).toBe('');
    // @ts-expect-error - testing undefined
    expect(escapeHtml(undefined)).toBe('');
  });
});
