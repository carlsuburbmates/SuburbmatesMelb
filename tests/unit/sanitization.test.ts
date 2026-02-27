import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry';
      const expected = 'Tom &amp; Jerry';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape single and double quotes', () => {
      const input = '"Hello" \'World\'';
      const expected = '&quot;Hello&quot; &#039;World&#039;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should replace newlines with spaces', () => {
      const input = 'Header\nInjection';
      const expected = 'Header Injection';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should replace carriage returns with spaces', () => {
      const input = 'Header\rInjection';
      const expected = 'Header Injection';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should replace mixed newlines with single space', () => {
      const input = 'Header\r\nInjection';
      const expected = 'Header Injection';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should trim whitespace', () => {
      const input = '  Header\nInjection  ';
      const expected = 'Header Injection';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(stripNewlines('')).toBe('');
    });
  });
});
