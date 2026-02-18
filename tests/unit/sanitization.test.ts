import { describe, it, expect } from 'vitest';
import { escapeHtml, stripHtml } from '../../src/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle single quotes', () => {
      const input = "It's me";
      const expected = "It&#039;s me";
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for non-string input', () => {
      // @ts-expect-error - Testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error - Testing invalid input
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      const input = '<p>Hello <b>World</b></p>';
      const expected = 'Hello World';
      expect(stripHtml(input)).toBe(expected);
    });

    it('should handle nested tags', () => {
      const input = '<div><span>Text</span></div>';
      const expected = 'Text';
      expect(stripHtml(input)).toBe(expected);
    });

    it('should return empty string for non-string input', () => {
      // @ts-expect-error - Testing invalid input
      expect(stripHtml(null)).toBe('');
    });
  });
});
