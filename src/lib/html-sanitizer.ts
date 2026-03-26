/**
 * Utility functions for HTML sanitization to prevent XSS and Email Header Injection.
 */

/**
 * Escapes HTML characters in a string to prevent XSS attacks when embedding user input into HTML.
 * Note: Ampersand must be replaced first to avoid double-escaping.
 *
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips newline characters (\n, \r) from a string to prevent Email Header Injection.
 *
 * @param {string} str - The string to strip.
 * @returns {string} The stripped string.
 */
export function stripNewlines(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/[\r\n]/g, '');
}
