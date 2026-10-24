/**
 * Instagram URL Validation and Canonicalization Utilities
 * Complies with Section 5 of Project Dhurandhar Developer Specification
 */

export interface InstagramValidationResult {
  isValid: boolean;
  canonicalUrl: string;
  postId?: string;
  postType?: "post" | "reel" | "tv";
  errorMessage?: string;
}

/**
 * Validates and sanitizes an Instagram post or Reel URL.
 * Strips tracking query parameters (utm_*, igsh, etc.).
 * Strictly verifies the domain is instagram.com and path begins with /p/, /reel/, or /tv/.
 */
export function validateAndCleanInstagramUrl(rawUrl: string): InstagramValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      isValid: false,
      canonicalUrl: "",
      errorMessage: "Instagram URL is required.",
    };
  }

  const trimmed = rawUrl.trim();

  // Reject malicious pseudo-protocols immediately
  if (
    trimmed.toLowerCase().startsWith("javascript:") ||
    trimmed.toLowerCase().startsWith("data:") ||
    trimmed.toLowerCase().startsWith("vbscript:")
  ) {
    return {
      isValid: false,
      canonicalUrl: "",
      errorMessage: "Invalid URL scheme.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      canonicalUrl: "",
      errorMessage: "Invalid URL format. Please provide a complete URL starting with https://",
    };
  }

  // Must be HTTPS
  if (parsed.protocol !== "https:") {
    return {
      isValid: false,
      canonicalUrl: "",
      errorMessage: "Instagram URL must use HTTPS.",
    };
  }

  // Strictly check hostname: instagram.com or www.instagram.com (reject lookalikes)
  const host = parsed.hostname.toLowerCase();
  if (host !== "instagram.com" && host !== "www.instagram.com") {
    return {
      isValid: false,
      canonicalUrl: "",
      errorMessage: "Only valid URLs from instagram.com are permitted.",
    };
  }

  // Check path pattern: /p/{id}/, /reel/{id}/, /tv/{id}/
  const pathname = parsed.pathname;
  const match = pathname.match(/^\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);

  if (!match) {
    return {
      isValid: false,
      canonicalUrl: "",
      errorMessage: "URL must be a public Instagram post or Reel (e.g. https://www.instagram.com/reel/CODE/).",
    };
  }

  const postType = match[1] === "reel" ? "reel" : match[1] === "tv" ? "tv" : "post";
  const postId = match[2];

  // Construct clean canonical URL without tracking garbage
  const canonicalUrl = `https://www.instagram.com/${match[1]}/${postId}/`;

  return {
    isValid: true,
    canonicalUrl,
    postId,
    postType,
  };
}

/**
 * Returns the official Instagram iframe embed URL
 */
export function getInstagramEmbedUrl(canonicalUrl: string): string {
  if (!canonicalUrl) return "";
  const cleaned = canonicalUrl.endsWith("/") ? canonicalUrl : `${canonicalUrl}/`;
  return `${cleaned}embed/`;
}
