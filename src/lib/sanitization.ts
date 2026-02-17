/**
 * Sanitization Utilities
 * Prevention of XSS and other injection attacks.
 */

/**
 * Escapes HTML special characters to prevent XSS.
 * This should be used when inserting untrusted text into HTML.
 *
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
 * Removes all HTML tags from a string.
 * This is useful for sanitizing text that should be plain text.
 *
 * @param str The string to strip.
 * @returns The string with HTML tags removed.
 */
export function stripHtml(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
}
