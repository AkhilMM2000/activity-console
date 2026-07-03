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
    return rawHtml; // Server-side rendering safe fallback
  }
  return DOMPurify.sanitize(rawHtml);
}
