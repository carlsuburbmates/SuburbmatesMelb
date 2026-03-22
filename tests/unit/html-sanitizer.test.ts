import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('HTML Sanitizer Utility', () => {
  describe('escapeHtml', () => {
    it('should escape HTML characters correctly', () => {
      const input = '<script>alert("1")</script>';
      const expected = '&lt;script&gt;alert(&quot;1&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should not double-escape ampersands', () => {
      const input = 'foo & bar &amp; baz';
      const expected = 'foo &amp; bar &amp;amp; baz';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle single quotes', () => {
      const input = "It's a beautiful day";
      const expected = 'It&#039;s a beautiful day';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for nullish/empty values', () => {
      expect(escapeHtml('')).toBe('');
      // @ts-expect-error testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error testing invalid input
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should strip newline characters (CR and LF)', () => {
      const input = 'Hello\r\nWorld\nThis\ris\n\n\ra test';
      const expected = 'Hello World This is a test';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should return the original string if no newlines exist', () => {
      const input = 'Hello World';
      expect(stripNewlines(input)).toBe(input);
    });

    it('should return empty string for nullish/empty values', () => {
      expect(stripNewlines('')).toBe('');
      // @ts-expect-error testing invalid input
      expect(stripNewlines(null)).toBe('');
      // @ts-expect-error testing invalid input
      expect(stripNewlines(undefined)).toBe('');
    });
  });
});
