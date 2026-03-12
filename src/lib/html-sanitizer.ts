/**
 * HTML Sanitization Utilities
 */

/**
 * Escapes HTML characters in a string to prevent XSS.
 * This should be used before rendering user input or inserting into HTML templates.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips newlines from a string. Useful for email subjects to prevent header injection.
 */
export function stripNewlines(text: string): string {
  if (!text) return '';
  return text.replace(/[\r\n]+/g, ' ').trim();
}
