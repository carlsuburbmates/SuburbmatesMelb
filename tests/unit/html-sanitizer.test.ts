import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('should escape all special HTML characters', () => {
      const input = '<script>alert("XSS & testing\'s!")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; testing&#039;s!&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for falsy input', () => {
      expect(escapeHtml('')).toBe('');
      // @ts-expect-error testing invalid input
      expect(escapeHtml(undefined)).toBe('');
      // @ts-expect-error testing invalid input
      expect(escapeHtml(null)).toBe('');
    });

    it('should handle strings with no special characters', () => {
      const input = 'Hello World';
      expect(escapeHtml(input)).toBe(input);
    });
  });

  describe('stripNewlines', () => {
    it('should replace \\n with a space', () => {
      const input = 'Line 1\nLine 2';
      expect(stripNewlines(input)).toBe('Line 1 Line 2');
    });

    it('should replace \\r\\n with a space', () => {
      const input = 'Line 1\r\nLine 2';
      expect(stripNewlines(input)).toBe('Line 1 Line 2');
    });

    it('should replace multiple newlines with spaces', () => {
      const input = 'A\nB\r\nC';
      expect(stripNewlines(input)).toBe('A B C');
    });

    it('should return empty string for falsy input', () => {
      expect(stripNewlines('')).toBe('');
      // @ts-expect-error testing invalid input
      expect(stripNewlines(undefined)).toBe('');
      // @ts-expect-error testing invalid input
      expect(stripNewlines(null)).toBe('');
    });
  });
});
