import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters correctly', () => {
      const input = '<script>alert("XSS & testing\'s!")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; testing&#039;s!&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for null or undefined', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    it('should handle non-string inputs by converting them to string', () => {
      // @ts-expect-error deliberately passing a number for testing
      expect(escapeHtml(123)).toBe('123');
      // @ts-expect-error deliberately passing a boolean for testing
      expect(escapeHtml(true)).toBe('true');
    });

    it('should return same string if no special characters exist', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('stripNewlines', () => {
    it('should replace newlines with a space and trim', () => {
      const input = 'Subject\nwith\rnewlines\r\n';
      const expected = 'Subject with newlines';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should return empty string for null or undefined', () => {
      expect(stripNewlines(null)).toBe('');
      expect(stripNewlines(undefined)).toBe('');
    });

    it('should handle non-string inputs', () => {
      // @ts-expect-error deliberately passing a number for testing
      expect(stripNewlines(123)).toBe('123');
    });

    it('should return same string if no newlines exist', () => {
      expect(stripNewlines('Hello World')).toBe('Hello World');
    });
  });
});
