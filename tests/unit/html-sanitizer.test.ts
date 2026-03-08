import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '../../src/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('should escape HTML characters', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(escapeHtml('&"\'')).toBe('&amp;&quot;&#039;');
    });

    it('should return empty string for falsy input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('stripNewlines', () => {
    it('should strip newlines', () => {
      expect(stripNewlines('line1\nline2\r\nline3')).toBe('line1 line2 line3');
    });

    it('should return empty string for falsy input', () => {
      expect(stripNewlines('')).toBe('');
    });
  });
});
