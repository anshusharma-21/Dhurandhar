import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";

export interface ExtractedInstagramData {
  success: boolean;
  caption?: string;
  videoUrl?: string;
  mediaBase64?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Extracts caption, metadata, and optional video/audio stream from an Instagram Reel or post URL.
 */
export async function extractInstagramMedia(rawUrl: string): Promise<ExtractedInstagramData> {
  const validation = validateAndCleanInstagramUrl(rawUrl);
  if (!validation.isValid || !validation.postId) {
    return {
      success: false,
      error: validation.errorMessage || "Invalid Instagram URL format.",
    };
  }

  const { canonicalUrl, postId, postType } = validation;
  let foundCaption: string | undefined;
  let foundVideoUrl: string | undefined;

  // Attempt 1: Fetch through Instagram's captioned embed
  try {
    const embedUrl = `https://www.instagram.com/${postType || "reel"}/${postId}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const html = await res.text();

      // Extract caption from embed
      const captionMatch =
        html.match(/<div class="Caption">([\s\S]*?)<\/div>/i) ||
        html.match(/class="CaptionText">([\s\S]*?)<\/span>/i);

      if (captionMatch && captionMatch[1]) {
        // Strip HTML tags and clean up entities
        const clean = captionMatch[1]
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();

        if (clean.length > 5) {
          foundCaption = clean;
        }
      }

      // Check for video_url in embed script state
      const videoMatch =
        html.match(/video_url\\":\\"([^"\\]+)/) ||
        html.match(/"video_url":"([^"]+)"/);
      if (videoMatch && videoMatch[1]) {
        foundVideoUrl = videoMatch[1].replace(/\\u0026/g, "&");
      }
    }
  } catch (err: any) {
    console.warn("Instagram embed fetch warning:", err.message);
  }

  // Attempt 2: Try public fallback downloader if no video URL found
  if (!foundVideoUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const fallbackApi = `https://api.vkrdown.com/web/app/instagram.php?data=${encodeURIComponent(canonicalUrl)}`;
      const res = await fetch(fallbackApi, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json?.data?.video || json?.data?.url || json?.url) {
          foundVideoUrl = json.data?.video || json.data?.url || json.url;
        }
        if (!foundCaption && json?.data?.title) {
          foundCaption = json.data.title;
        }
      }
    } catch {
      // Non-blocking fallback attempt
    }
  }

  // If we have a video URL, try downloading it (up to 20MB)
  if (foundVideoUrl) {
    try {
      const vidRes = await fetch(foundVideoUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (vidRes.ok) {
        const arrayBuf = await vidRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // Ensure within Gemini 20MB inline limit
        if (buffer.length > 0 && buffer.length <= 20 * 1024 * 1024) {
          return {
            success: true,
            caption: foundCaption,
            videoUrl: foundVideoUrl,
            mediaBase64: buffer.toString("base64"),
            mimeType: "video/mp4",
          };
        }
      }
    } catch (vidErr: any) {
      console.warn("Could not download video stream:", vidErr.message);
    }
  }

  // Return whatever we have (even caption alone is useful)
  return {
    success: Boolean(foundCaption || foundVideoUrl),
    caption: foundCaption,
    videoUrl: foundVideoUrl,
  };
}
