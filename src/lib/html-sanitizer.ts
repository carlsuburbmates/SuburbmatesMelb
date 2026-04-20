export function escapeHtml(unsafe: string): string {
  if (!unsafe) return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function stripNewlines(input: string | undefined): string | undefined {
  if (typeof input !== "string") return input;
  return input.replace(/[\r\n]+/g, "");
}
