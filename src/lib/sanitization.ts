/**
 * Utility functions for sanitizing user inputs.
 */

/**
 * Escapes HTML characters in a string to prevent Cross-Site Scripting (XSS).
 * Encodes: &, <, >, ", '
 *
 * @param input The string to escape.
 * @returns The escaped HTML string.
 */
export function escapeHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strips newline characters (\r, \n) from a string to prevent Header Injection.
 * Replaces them with spaces.
 *
 * @param input The string to sanitize.
 * @returns The sanitized string without newlines.
 */
export function stripNewlines(input: string): string {
  if (!input) return "";
  return input.replace(/[\r\n]+/g, " ").trim();
}
