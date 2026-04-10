/**
 * Sanitizes input to prevent HTML injection and escaping issues.
 * @param input The string to sanitize.
 * @returns The sanitized string.
 */
export function escapeHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strips newline characters from input to prevent CRLF injection.
 * @param input The string to sanitize.
 * @returns The sanitized string without newline characters.
 */
export function stripNewlines(input: string): string {
  if (!input) return "";
  return input.replace(/[\r\n]/g, "");
}
