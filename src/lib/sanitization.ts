/**
 * SuburbMates V1.1 - Sanitization Utilities
 * Helper functions for sanitizing user input
 */

/**
 * Escapes HTML special characters to prevent XSS.
 * Use this when displaying user input in HTML contexts (e.g., emails).
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
 * Strips all HTML tags from a string.
 * Use this when you want plain text from user input.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, "");
}
