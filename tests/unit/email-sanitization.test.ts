import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('Security: HTML Sanitization', () => {
  it('should escape basic HTML characters', () => {
    const input = '<script>alert("xss")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should escape single quotes', () => {
    const input = "It's me";
    const expected = "It&#039;s me";
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle ampersands', () => {
    const input = 'Fish & Chips';
    const expected = 'Fish &amp; Chips';
    expect(escapeHtml(input)).toBe(expected);
  });
});
