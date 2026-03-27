
/**
 * Strips HTML tags from a string to prevent XSS attacks.
 * @param unsafe - The potentially unsafe string.
 * @returns The sanitized string with HTML tags removed.
 */
export function stripHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe.replace(/<[^>]*>/g, '');
}
