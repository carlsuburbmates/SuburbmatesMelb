/**
 * Security-related sanitization utilities.
 */

/**
 * Escapes HTML special characters to prevent Cross-Site Scripting (XSS).
 * Use this when embedding user input into HTML content.
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
 * Removes newline characters to prevent Header Injection.
 * use this when using user input in email subjects or other headers.
 */
export function stripNewlines(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/(\r\n|\n|\r)/gm, " ");
}
