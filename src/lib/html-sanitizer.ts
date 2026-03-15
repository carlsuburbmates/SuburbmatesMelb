/**
 * HTML Sanitization Utilities
 * Used to prevent Cross-Site Scripting (XSS) and injection attacks.
 */

/**
 * Escapes HTML characters in a string to prevent XSS.
 * Should be used whenever user input is interpolated into HTML strings (e.g., email templates).
 *
 * @param str The string to escape
 * @returns The escaped string, or empty string if input is falsy
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips newline characters from a string.
 * Useful for email subjects to prevent email header injection.
 *
 * @param str The string to strip newlines from
 * @returns The stripped string, or empty string if input is falsy
 */
export function stripNewlines(str: string | null | undefined): string {
  if (!str) return '';

  return String(str).replace(/[\r\n]+/g, ' ').trim();
}
