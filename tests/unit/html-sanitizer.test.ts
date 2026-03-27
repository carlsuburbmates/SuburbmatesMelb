import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('html-sanitizer utilities', () => {
  describe('escapeHtml', () => {
    it('escapes standard HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('escapes single and double quotes', () => {
      const input = 'It\'s "test" time';
      const expected = 'It&#039;s &quot;test&quot; time';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('escapes ampersands first to prevent double escaping', () => {
      const input = 'Fish & Chips & <p>Test</p>';
      const expected = 'Fish &amp; Chips &amp; &lt;p&gt;Test&lt;/p&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('handles empty strings safely', () => {
      expect(escapeHtml('')).toBe('');
      // @ts-expect-error Testing invalid input gracefully
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error Testing invalid input gracefully
      expect(escapeHtml(undefined)).toBe('');
    });

    it('returns benign string unaltered', () => {
      const input = 'Just a normal string with no special chars.';
      expect(escapeHtml(input)).toBe(input);
    });
  });

  describe('stripNewlines', () => {
    it('removes \\n characters', () => {
      const input = 'Line 1\nLine 2';
      const expected = 'Line 1Line 2';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('removes \\r characters', () => {
      const input = 'Line 1\rLine 2';
      const expected = 'Line 1Line 2';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('removes combined CRLF \\r\\n characters', () => {
      const input = 'Line 1\r\nLine 2\r\nLine 3';
      const expected = 'Line 1Line 2Line 3';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('handles empty strings safely', () => {
      expect(stripNewlines('')).toBe('');
      // @ts-expect-error Testing invalid input gracefully
      expect(stripNewlines(null)).toBe('');
      // @ts-expect-error Testing invalid input gracefully
      expect(stripNewlines(undefined)).toBe('');
    });

    it('returns string without newlines unaltered', () => {
      const input = 'No newlines here.';
      expect(stripNewlines(input)).toBe(input);
    });
  });
});
