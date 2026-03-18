import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('should correctly escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle single quotes and ampersands', () => {
      const input = "Tom & Jerry's";
      const expected = "Tom &amp; Jerry&#039;s";
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for falsy input', () => {
      expect(escapeHtml('')).toBe('');
      // @ts-expect-error - testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should strip all newline and carriage return characters', () => {
      const input = "hello\r\nworld\n!";
      const expected = "helloworld!";
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should return the same string if no newlines exist', () => {
      const input = "hello world";
      expect(stripNewlines(input)).toBe(input);
    });

    it('should return empty string for falsy input', () => {
      expect(stripNewlines('')).toBe('');
      // @ts-expect-error - testing invalid input
      expect(stripNewlines(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(stripNewlines(undefined)).toBe('');
    });
  });
});
