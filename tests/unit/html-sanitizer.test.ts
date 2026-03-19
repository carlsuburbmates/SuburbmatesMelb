import { describe, it, expect } from 'vitest';
import { escapeHtml, stripNewlines } from '@/lib/html-sanitizer';

describe('html-sanitizer', () => {
  describe('escapeHtml', () => {
    it('escapes basic html tags', () => {
      expect(escapeHtml('<div>Test</div>')).toBe('&lt;div&gt;Test&lt;/div&gt;');
    });

    it('escapes quotes and ampersands', () => {
      expect(escapeHtml('Test "quoted" & \'single\'')).toBe('Test &quot;quoted&quot; &amp; &#039;single&#039;');
    });
  });

  describe('stripNewlines', () => {
    it('removes newlines', () => {
      expect(stripNewlines('line1\nline2\r\nline3')).toBe('line1 line2 line3');
    });
  });
});
