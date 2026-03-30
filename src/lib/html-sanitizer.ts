/**
 * Utility functions to sanitize HTML and text inputs
 */

/**
 * Escapes characters that have special meaning in HTML.
 * Processing '&' first to prevent double-escaping other entities.
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
 * Strips newline characters to prevent CRLF and Email Header Injection.
 */
export function stripNewlines(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/\r|\n/g, '');
}
