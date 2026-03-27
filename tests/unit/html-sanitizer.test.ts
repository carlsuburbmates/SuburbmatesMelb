import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('escapes common HTML entities', () => {
      const input = '<script>alert("XSS & fun")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; fun&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('handles empty strings', () => {
      expect(escapeHtml('')).toBe('');
      // @ts-expect-error Testing invalid input gracefully
      expect(escapeHtml(null)).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('removes newline characters', () => {
      const input = 'Hello\nWorld\r\nTest';
      const expected = 'Hello World Test';
      expect(stripNewlines(input)).toBe(expected);
    });
  });
});
