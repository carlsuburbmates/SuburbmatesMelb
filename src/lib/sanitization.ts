/**
 * Security utilities for sanitizing user inputs.
 */

/**
 * Escapes characters with special meaning in HTML to prevent Cross-Site Scripting (XSS).
 * This should be used on any user input before inserting it into an HTML template.
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
 * Removes newline characters from a string to prevent Header Injection attacks.
 * This should be used on any user input inserted into email subjects or HTTP headers.
 */
export function stripNewlines(str: string): string {
  if (!str) return '';
  // Replace all newline and carriage return characters with a space
  return str.replace(/[\r\n]+/g, ' ').trim();
}
