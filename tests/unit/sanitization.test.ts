import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape basic HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Me & You';
      const expected = 'Me &amp; You';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape single quotes', () => {
      const input = "It's me";
      const expected = 'It&#039;s me';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle strings with no special characters', () => {
      const input = 'Hello World';
      expect(escapeHtml(input)).toBe(input);
    });
  });

  describe('stripNewlines', () => {
    it('should remove newlines', () => {
      const input = 'Hello\nWorld';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should remove carriage returns', () => {
      const input = 'Hello\rWorld';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should handle mixed newlines', () => {
      const input = 'Line 1\r\nLine 2\nLine 3';
      const expected = 'Line 1 Line 2 Line 3';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should trim whitespace', () => {
      const input = '\n  Hello World  \n';
      const expected = 'Hello World';
      expect(stripNewlines(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      expect(stripNewlines('')).toBe('');
    });
  });
});
