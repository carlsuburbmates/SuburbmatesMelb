/**
 * HTML Sanitization utility functions
 * To be used to prevent HTML injection and escaping issues,
 * especially in contexts like email templates.
 */

/**
 * Escapes characters that have special meaning in HTML.
 * Converts &, <, >, ", and ' to their corresponding HTML entities.
 *
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
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
 * Strips all newline characters (\n and \r) from a string.
 * Useful for preventing header injection in email subjects.
 *
 * @param {string} str - The string to strip newlines from.
 * @returns {string} The string without newlines.
 */
export function stripNewlines(str: string): string {
  if (!str) return '';
  return str.replace(/[\r\n]+/g, '');
}
