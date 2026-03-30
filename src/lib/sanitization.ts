/**
 * SuburbMates V1.1 - Sanitization Utilities
 * Functions for sanitizing user input to prevent XSS.
 */

/**
 * Escapes HTML special characters to prevent XSS in HTML contexts (e.g., email bodies).
 * Replaces &, <, >, ", ' with their corresponding HTML entities.
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Removes all HTML tags from a string.
 * Useful for storing plain text versions of input or preventing stored XSS.
 */
export function stripHtml(html: string): string {
  if (typeof html !== 'string') return '';
  return html.replace(/<[^>]*>?/gm, '');
}
