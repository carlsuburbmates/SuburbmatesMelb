
import { describe, it, expect } from 'vitest';
import { isAllowedOrigin } from '../../src/middleware/cors';

describe('CORS Security Vulnerability', () => {
  it('should allow legitimate localhost', () => {
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
  });

  it('should allow legitimate localhost with other ports', () => {
    expect(isAllowedOrigin('http://localhost:8080')).toBe(true);
  });

  it('should deny evil-localhost.com', () => {
    // This test confirms the vulnerability is fixed
    expect(isAllowedOrigin('http://evil-localhost.com')).toBe(false);
  });

  it('should deny localhost.evil.com', () => {
    // This test confirms the vulnerability is fixed
    expect(isAllowedOrigin('http://localhost.evil.com')).toBe(false);
  });
});
