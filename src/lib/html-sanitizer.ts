/**
 * Utility functions for HTML sanitization to prevent injection vulnerabilities.
 */

/**
 * Escapes HTML characters in a string to prevent XSS.
 * Always processes the ampersand character first to avoid double-escaping.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strips newline characters from a string to prevent CRLF injection.
 */
export function stripNewlines(unsafe: string): string {
  if (!unsafe) return '';

  return unsafe.replace(/[\r\n]+/g, " ");
}
