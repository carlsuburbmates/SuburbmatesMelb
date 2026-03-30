import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils';

describe('escapeHtml', () => {
  it('should escape &', () => {
    expect(escapeHtml('Ben & Jerry')).toBe('Ben &amp; Jerry');
  });

  it('should escape < and >', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('should escape " and \'', () => {
    expect(escapeHtml('"quoted" and \'single\'')).toBe('&quot;quoted&quot; and &#039;single&#039;');
  });

  it('should return safe string as is', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle string with mixed unsafe characters', () => {
    expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });
});
