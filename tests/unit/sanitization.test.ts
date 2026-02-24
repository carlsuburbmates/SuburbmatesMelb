import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('escapes basic HTML tags', () => {
      const input = '<script>alert(1)</script>';
      const expected = '&lt;script&gt;alert(1)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('escapes attributes', () => {
      const input = '<img src=x onerror=alert(1)>';
      const expected = '&lt;img src=x onerror=alert(1)&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('escapes quotes', () => {
      const input = '"quote" and \'single\'';
      const expected = '&quot;quote&quot; and &#039;single&#039;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('escapes ampersands', () => {
      const input = 'This & That';
      const expected = 'This &amp; That';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('handles empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('removes newlines', () => {
      const input = 'Hello\nWorld';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('removes carriage returns', () => {
      const input = 'Hello\rWorld';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('removes mixed newlines', () => {
      const input = 'Line1\r\nLine2\nLine3';
      const expected = 'Line1 Line2 Line3';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('handles empty strings', () => {
      expect(stripNewlines('')).toBe('');
    });
  });
});
