import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('should escape html special characters', () => {
      const input = '<script>alert("XSS & testing\'s")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; testing&#039;s&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle undefined or null by returning empty string (based on implementation)', () => {
      // @ts-expect-error - testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should remove carriage returns and line feeds and trim', () => {
      const input = 'Hello\nWorld\r\nTest\r';
      expect(stripNewlines(input)).toBe('Hello World Test');
    });

    it('should handle empty strings', () => {
      expect(stripNewlines('')).toBe('');
    });

    it('should handle undefined or null by returning empty string', () => {
      // @ts-expect-error - testing invalid input
      expect(stripNewlines(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(stripNewlines(undefined)).toBe('');
    });
  });
});
