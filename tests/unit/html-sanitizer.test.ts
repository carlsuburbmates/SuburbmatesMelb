import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('HTML Sanitizer Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape < and >', () => {
      expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    it('should escape &', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
      expect(escapeHtml("'world'")).toBe('&#039;world&#039;');
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle undefined or null gracefully', () => {
      // @ts-expect-error testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error testing invalid input
      expect(escapeHtml(undefined)).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should remove newline characters', () => {
      expect(stripNewlines('hello\nworld')).toBe('hello world');
      expect(stripNewlines('hello\rworld')).toBe('hello world');
      expect(stripNewlines('hello\r\nworld')).toBe('hello world');
    });

    it('should handle multiple newlines', () => {
      expect(stripNewlines('hello\n\nworld\n')).toBe('hello world');
    });

    it('should handle empty strings', () => {
      expect(stripNewlines('')).toBe('');
    });

    it('should handle undefined or null gracefully', () => {
      // @ts-expect-error testing invalid input
      expect(stripNewlines(null)).toBe('');
      // @ts-expect-error testing invalid input
      expect(stripNewlines(undefined)).toBe('');
    });
  });
});
