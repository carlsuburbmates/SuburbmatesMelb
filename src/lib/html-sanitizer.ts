/**
 * Utility functions for HTML sanitization
 */

export function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function stripNewlines(str: string): string {
  if (!str) return "";
  return String(str).replace(/[\r\n]+/g, " ");
}
