/**
 * SuburbMates V1.1 - Security Sanitization Utilities
 * Centralized sanitization for preventing XSS and Injection attacks.
 */

/**
 * Escapes HTML characters to prevent XSS.
 * Use this when inserting untrusted strings into HTML content.
 *
 * @param unsafe The string to sanitize
 * @returns The sanitized string with special characters replaced by HTML entities
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strips newlines from a string to prevent Header Injection.
 * Use this for email subjects or other headers.
 *
 * @param unsafe The string to sanitize
 * @returns The string with newlines replaced by spaces
 */
export function stripNewlines(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[\r\n]+/g, " ");
}
