import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/sanitization';

describe('Sanitization Utilities', () => {
  describe('escapeHtml', () => {
    it('should handle null or undefined gracefully', () => {
      // @ts-expect-error - testing invalid input
      expect(escapeHtml(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(escapeHtml(undefined)).toBe('');
    });

    it('should return empty string for empty string input', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should not modify a string without special characters', () => {
      expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('This & That')).toBe('This &amp; That');
    });

    it('should escape less than and greater than signs', () => {
      expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    it('should escape double and single quotes', () => {
      expect(escapeHtml('"Hello" \'World\'')).toBe('&quot;Hello&quot; &#039;World&#039;');
    });

    it('should escape all special characters in a mixed string', () => {
      const input = '<div class="test" id=\'123\'>A & B</div>';
      const expected = '&lt;div class=&quot;test&quot; id=&#039;123&#039;&gt;A &amp; B&lt;/div&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });
  });

  describe('stripNewlines', () => {
    it('should handle null or undefined gracefully', () => {
      // @ts-expect-error - testing invalid input
      expect(stripNewlines(null)).toBe('');
      // @ts-expect-error - testing invalid input
      expect(stripNewlines(undefined)).toBe('');
    });

    it('should return empty string for empty string input', () => {
      expect(stripNewlines('')).toBe('');
    });

    it('should not modify a string without newlines', () => {
      expect(stripNewlines('Hello World')).toBe('Hello World');
    });

    it('should remove single newline characters (\n)', () => {
      expect(stripNewlines('Hello\nWorld')).toBe('Hello World');
    });

    it('should remove carriage returns (\r)', () => {
      expect(stripNewlines('Hello\rWorld')).toBe('Hello World');
    });

    it('should remove combined carriage return and newline (\r\n)', () => {
      expect(stripNewlines('Hello\r\nWorld')).toBe('Hello World');
    });

    it('should handle multiple consecutive newlines', () => {
      expect(stripNewlines('Hello\n\n\nWorld')).toBe('Hello World');
    });

    it('should trim leading and trailing spaces that result from stripping', () => {
      expect(stripNewlines('\nHello World\n')).toBe('Hello World');
    });
  });
});
