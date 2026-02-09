import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../../src/lib/utils';

describe('escapeHtml', () => {
  it('escapes special characters', () => {
    const input = '<script>alert("XSS")</script> & \'';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; &#039;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('handles regular string', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('handles mixed content', () => {
    const input = 'Hello <world>!';
    const expected = 'Hello &lt;world&gt;!';
    expect(escapeHtml(input)).toBe(expected);
  });
});
