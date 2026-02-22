import { describe, expect, it } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape single quotes', () => {
      const input = "It's a test";
      const expected = "It&#039;s a test";
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry';
      const expected = 'Tom &amp; Jerry';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should replace newlines with spaces', () => {
      const input = 'Hello\nWorld';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should replace carriage returns with spaces', () => {
      const input = 'Hello\rWorld';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should replace mixed newlines with spaces', () => {
      // \r\n matches as one block with [\r\n]+
      expect(stripNewlines('Hello\r\nWorld')).toBe('Hello World');
    });
  });
});
