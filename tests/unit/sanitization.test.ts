import { describe, expect, it } from 'vitest';
import { stripHtml, escapeHtml } from '@/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('stripHtml', () => {
    it('should remove simple HTML tags', () => {
      const input = '<p>Hello, <b>World</b>!</p>';
      const output = stripHtml(input);
      expect(output).toBe('Hello, World!');
    });

    it('should remove nested HTML tags', () => {
      const input = '<div><p><span>Nested</span></p></div>';
      const output = stripHtml(input);
      expect(output).toBe('Nested');
    });

    it('should remove script tags and content', () => {
      // stripHtml only removes tags, not content within tags like script body if it was innerHTML
      // but the regex /<[^>]*>/g removes the tags themselves.
      const input = '<script>alert(1)</script>';
      const output = stripHtml(input);
      expect(output).toBe('alert(1)');
    });

    it('should handle attributes', () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const output = stripHtml(input);
      expect(output).toBe('Link');
    });

    it('should handle incomplete tags gracefully', () => {
      const input = 'Text < incomplete tag';
      const output = stripHtml(input);
      // Regex <[^>]*> matches < followed by anything until >.
      // If there is no closing >, it won't match.
      expect(output).toBe('Text < incomplete tag');
    });

    it('should return empty string for null/undefined input (if types were loose)', () => {
        // @ts-expect-error - testing null
        expect(stripHtml(null)).toBe(null);
        // @ts-expect-error - testing undefined
        expect(stripHtml(undefined)).toBe(undefined);
    });
  });

  describe('escapeHtml', () => {
    it('should escape special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const output = escapeHtml(input);
      expect(output).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should escape ampersands', () => {
      const input = 'Ben & Jerry\'s';
      const output = escapeHtml(input);
      expect(output).toBe('Ben &amp; Jerry&#039;s');
    });

    it('should handle mixed content', () => {
        const input = '<b>Bold</b> & <i>Italic</i>';
        const output = escapeHtml(input);
        expect(output).toBe('&lt;b&gt;Bold&lt;/b&gt; &amp; &lt;i&gt;Italic&lt;/i&gt;');
    });
  });
});
