import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('utils', () => {
  describe('escapeHtml', () => {
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
      const expected = 'It&#39;s me';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle mixed content', () => {
      const input = '<div class="test">Bob\'s & Alice\'s</div>';
      const expected = '&lt;div class=&quot;test&quot;&gt;Bob&#39;s &amp; Alice&#39;s&lt;/div&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });
});
