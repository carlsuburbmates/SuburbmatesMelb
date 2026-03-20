import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('HTML Sanitizer Utilities', () => {
  describe('escapeHtml', () => {
    it('escapes basic HTML entities correctly', () => {
      const input = '<script>alert("xss & \'hack\'")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss &amp; &#039;hack&#039;&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('returns empty string for falsy input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('removes CRLF and LF newlines', () => {
      const input = 'Subject: Hello\r\nBcc: hacker@evil.com\nAnother line';
      const expected = 'Subject: HelloBcc: hacker@evil.comAnother line';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('returns empty string for falsy input', () => {
      expect(stripNewlines('')).toBe('');
    });
  });
});
