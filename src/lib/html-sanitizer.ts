/**
 * Utility functions for preventing HTML injection and XSS vulnerabilities.
 */

/**
 * Escapes HTML special characters to their corresponding entities to prevent XSS.
 * IMPORTANT: Always replace '&' first to avoid double-escaping other entities.
 *
 * @param input The untrusted string input from the user.
 * @returns The escaped, safe string for use in HTML bodies.
 */
export function escapeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips all newline characters (\r and \n) from a string.
 * This is crucial for preventing CRLF (Carriage Return Line Feed) injection,
 * commonly known as Email Header Injection, when user input is used in headers.
 *
 * @param input The untrusted string input from the user.
 * @returns The sanitized string with all newlines removed.
 */
export function stripNewlines(input: string): string {
  if (!input) return '';
  return input.replace(/[\r\n]/g, '');
}
