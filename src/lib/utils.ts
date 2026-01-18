import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Escapes HTML characters in a string to prevent XSS attacks.
 * Use this when interpolating user-provided data into HTML email bodies.
 *
 * @param str - The input string to escape
 * @returns The escaped string
 */
export function escapeHtml(str: string): string {
  if (!str) return '';

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
