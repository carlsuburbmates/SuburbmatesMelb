/**
 * SuburbMates V1.1 - HTML Sanitizer
 * Utility functions for safely escaping user input in HTML templates
 */

/**
 * Escapes characters that have special meaning in HTML to prevent XSS.
 * Should be used whenever user input is interpolated into an HTML string.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return '';

  const strValue = String(str);
  return strValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips newline characters to prevent header injection.
 * Should be used for email subjects and other single-line headers.
 */
export function stripNewlines(str: string | null | undefined): string {
  if (str == null) return '';

  const strValue = String(str);
  return strValue.replace(/[\r\n]+/g, ' ').trim();
}
