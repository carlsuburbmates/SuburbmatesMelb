export function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function stripNewlines(unsafe: string): string {
  if (!unsafe) return "";
  return String(unsafe).replace(/[\r\n]+/g, " ").trim();
}
