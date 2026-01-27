import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('escapeHtml', () => {
  it('should escape special characters', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should escape ampersands', () => {
    const input = 'Tom & Jerry';
    const expected = 'Tom &amp; Jerry';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should escape single quotes', () => {
    const input = "It's me";
    const expected = 'It&#39;s me';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should return the original string if no special characters are present', () => {
    const input = 'Hello World';
    const expected = 'Hello World';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    const input = '';
    const expected = '';
    expect(escapeHtml(input)).toBe(expected);
  });
});
