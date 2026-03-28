/**
 * SuburbMates V1.1 - HTML Sanitizer
 * Used to prevent HTML injection and escaping issues.
 */

/**
 * Escapes characters to prevent HTML injection.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strips newlines to prevent header injection.
 */
export function stripNewlines(unsafe: string): string {
  if (!unsafe) return unsafe;
  return unsafe.replace(/\r|\n/g, " ");
}
