/**
 * SuburbMates V1.1 - Sanitization Utilities
 */

/**
 * Remove HTML tags from a string
 * Used for sanitizing user input before database insertion (Stored XSS prevention)
 */
export function stripHtml(html: string): string {
  if (!html) return html;
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML special characters
 * Used for sanitizing user input before rendering in HTML context (e.g. emails)
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
