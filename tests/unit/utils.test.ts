import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('utils', () => {
  describe('escapeHtml', () => {
    it('should return safe strings unchanged', () => {
      const input = 'Hello World';
      expect(escapeHtml(input)).toBe('Hello World');
    });

    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Ben & Jerry';
      const expected = 'Ben &amp; Jerry';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape single quotes', () => {
      const input = "It's me";
      const expected = "It&#39;s me";
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle mixed content', () => {
      const input = '<div>"Hello" & \'Goodbye\'</div>';
      const expected = '&lt;div&gt;&quot;Hello&quot; &amp; &#39;Goodbye&#39;&lt;/div&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });
  });
});
