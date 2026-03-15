import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('escapes basic HTML tags', () => {
      expect(escapeHtml('<h1>Test</h1>')).toBe('&lt;h1&gt;Test&lt;/h1&gt;');
    });

    it('escapes attributes', () => {
      expect(escapeHtml('<a href="javascript:alert(1)">Click</a>')).toBe('&lt;a href=&quot;javascript:alert(1)&quot;&gt;Click&lt;/a&gt;');
    });

    it('escapes single quotes', () => {
      expect(escapeHtml("alert('XSS')")).toBe("alert(&#39;XSS&#39;)");
    });

    it('handles null/undefined gracefully', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    it('handles non-string inputs by converting to string', () => {
      expect(escapeHtml(123 as any)).toBe('123');
    });
  });

  describe('stripNewlines', () => {
    it('removes newline characters and replaces with space', () => {
      expect(stripNewlines('Hello\nWorld')).toBe('Hello World');
      expect(stripNewlines('Hello\r\nWorld')).toBe('Hello World');
    });

    it('handles multiple newlines', () => {
      expect(stripNewlines('Hello\n\n\nWorld')).toBe('Hello World');
    });

    it('trims whitespace', () => {
      expect(stripNewlines(' \n Hello World \n ')).toBe('Hello World');
    });

    it('handles null/undefined gracefully', () => {
      expect(stripNewlines(null)).toBe('');
      expect(stripNewlines(undefined)).toBe('');
    });
  });
});
