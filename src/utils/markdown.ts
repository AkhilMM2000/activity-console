import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Parses markdown to HTML and sanitizes it to prevent XSS attacks.
 */
export function renderMarkdown(markdown: string): string {
  // 1. Parse markdown using marked
  const rawHtml = marked.parse(markdown) as string;

  // 2. Sanitize using DOMPurify
  if (typeof window === 'undefined') {
    return ''; // Secure server-side rendering fallback (prevents unsanitized HTML leakage)
  }
  return DOMPurify.sanitize(rawHtml);
}
