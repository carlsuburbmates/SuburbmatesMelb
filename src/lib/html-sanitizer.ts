/**
 * HTML Sanitization Utilities
 */

/**
 * Escapes HTML entities to prevent HTML injection and XSS
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
 * Strips newlines to prevent CRLF injection (e.g. in email headers)
 */
export function stripNewlines(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[\r\n]+/g, " ");
}
