/**
 * Sanitization utilities for security.
 */

/**
 * Escapes HTML characters to prevent XSS.
 * Replaces &, <, >, ", ' with HTML entities.
 *
 * @param str The string to escape
 * @returns The escaped string
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strips newlines to prevent header injection in emails.
 * Replaces \n and \r with spaces.
 *
 * @param str The string to sanitize
 * @returns The sanitized string
 */
export function stripNewlines(str: string): string {
  if (!str) return '';
  return str.replace(/[\r\n]+/g, ' ').trim();
}
