import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('escapes basic HTML entities', () => {
      expect(escapeHtml('<script>alert("1")</script>')).toBe('&lt;script&gt;alert(&quot;1&quot;)&lt;/script&gt;');
      expect(escapeHtml("John's Book")).toBe("John&#039;s Book");
      expect(escapeHtml('Salt & Pepper')).toBe('Salt &amp; Pepper');
    });

    it('returns empty string for non-string input', () => {
      // @ts-expect-error Testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(escapeHtml(123)).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('replaces newlines with spaces', () => {
      expect(stripNewlines('Hello\nWorld')).toBe('Hello World');
      expect(stripNewlines('Multi\r\nLine\rString')).toBe('Multi Line String');
    });

    it('returns empty string for non-string input', () => {
      // @ts-expect-error Testing invalid input
      expect(stripNewlines(undefined)).toBe('');
    });
  });
});
