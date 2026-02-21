/**
 * Sanitization Utilities
 * Helper functions to prevent XSS and Header Injection
 */

/**
 * Escapes HTML special characters to prevent XSS.
 * @param str The string to escape.
 * @returns The escaped string.
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
 * Removes newlines to prevent Header Injection.
 * Replaces newlines with spaces.
 * @param str The string to sanitize.
 * @returns The sanitized string without newlines.
 */
export function stripNewlines(str: string): string {
  if (!str) return '';
  return str.replace(/[\r\n]+/g, ' ').trim();
}
