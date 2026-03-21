/**
 * HTML Sanitization Utilities
 * Protects against XSS and HTML injection in rendered content (e.g. emails)
 */

/**
 * Escapes HTML special characters to prevent HTML injection.
 * Ampersand (&) must be replaced first to avoid double-escaping.
 *
 * @param {string} input - The string to escape
 * @returns {string} The escaped string
 */
export function escapeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strips newline characters to prevent CRLF injection in headers or simple text fields.
 *
 * @param {string} input - The string to strip
 * @returns {string} The stripped string
 */
export function stripNewlines(input: string | null | undefined): string {
  if (!input) return "";
  return String(input).replace(/[\r\n]+/g, " ").trim();
}
