import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/sanitization';

describe('Sanitization Utils', () => {
  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Me & You';
      const expected = 'Me &amp; You';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape single quotes', () => {
      const input = "It's me";
      const expected = "It&#039;s me";
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });
});
