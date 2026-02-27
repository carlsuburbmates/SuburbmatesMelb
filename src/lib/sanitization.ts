/**
 * Sanitization utilities for preventing XSS and injection attacks.
 */

/**
 * Escapes HTML special characters to prevent XSS.
 * @param str The string to escape
 * @returns The escaped string
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips newlines to prevent header injection.
 * @param str The string to strip
 * @returns The string with newlines replaced by spaces
 */
export function stripNewlines(str: string): string {
  if (!str) return '';
  return str.replace(/[\r\n]+/g, ' ').trim();
}
