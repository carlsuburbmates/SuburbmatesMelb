/**
 * HTML Sanitization Utilities
 * Prevents HTML injection, XSS, and CRLF (Email Header) injection.
 */

/**
 * Escapes characters that are special in HTML.
 * Process '&' first to avoid double-escaping entities.
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
 * Strips newline characters from strings.
 * Useful for preventing CRLF injection in email headers.
 */
export function stripNewlines(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/\r?\n|\r/g, "");
}
