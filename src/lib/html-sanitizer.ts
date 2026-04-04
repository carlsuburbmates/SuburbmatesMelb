export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function stripNewlines(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/\r\n|\r|\n/g, ' ');
}
