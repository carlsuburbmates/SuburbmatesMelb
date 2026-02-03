import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../../src/lib/utils';

describe('escapeHtml', () => {
  it('should escape special characters', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle ampersands correctly', () => {
    const input = 'Ben & Jerry\'s';
    const expected = 'Ben &amp; Jerry&#039;s';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should return empty string for null/undefined/empty input', () => {
    // @ts-expect-error - testing null input
    expect(escapeHtml(null)).toBe('');
    // @ts-expect-error - testing undefined input
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml('')).toBe('');
  });

  it('should return original string if no special characters', () => {
    const input = 'Hello World';
    expect(escapeHtml(input)).toBe(input);
  });
});
