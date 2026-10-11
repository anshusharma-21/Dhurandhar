/**
 * Input sanitization and XSS prevention utilities
 * Complies with Acceptance Criterion AC-12
 */

/**
 * Escapes special HTML characters to prevent XSS injection.
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Strips script tags, iframe tags, and event handlers from text.
 */
export function sanitizePlainText(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  let cleaned = input
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove inline event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    // Remove javascript: and data: pseudo protocols
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "");

  // Strip remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  return cleaned.trim();
}

/**
 * Validates text against abusive spam or excessive repetition
 */
export function checkSpamSignals(text: string): { isSpam: boolean; reason?: string } {
  if (!text) return { isSpam: false };

  // Detect excessive URLs (> 2 URLs in a comment)
  const urlMatches = text.match(/https?:\/\//gi);
  if (urlMatches && urlMatches.length > 2) {
    return { isSpam: true, reason: "Excessive links detected." };
  }

  // Detect repeated character spam (e.g. aaaaaaaaaaaaaaa)
  if (/(.)\1{10,}/.test(text)) {
    return { isSpam: true, reason: "Repetitive character sequence." };
  }

  return { isSpam: false };
}
