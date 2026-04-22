/**
 * SuburbMates - HTML and Text Sanitization Utilities
 */

/**
 * Escapes characters that have special meaning in HTML to prevent XSS.
 * IMPORTANT: Always process the ampersand character ('&') first to avoid double-escaping.
 * @param str The string to escape.
 * @returns The escaped string.
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
 * Strips carriage return and newline characters from a string to prevent CRLF injection
 * (e.g., Email Header Injection).
 * @param str The string to strip.
 * @returns The stripped string.
 */
export function stripNewlines(str: string | undefined): string | undefined {
  if (typeof str !== 'string') return str;
  return str.replace(/[\r\n]/g, '');
}
