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
 * Extracts caption, metadata, and video/audio stream from an Instagram Reel or post URL.
 * Supports RapidAPI Instagram Downloaders as primary high-reliability provider,
 * with resilient multi-tier fallback scrapers.
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

  // --------------------------------------------------------------------------
  // Provider 1: RapidAPI Instagram Downloader (Primary High-Reliability Provider)
  // --------------------------------------------------------------------------
  const rapidApiKey =
    process.env.RAPIDAPI_KEY ||
    process.env.RAPID_API_KEY ||
    process.env.INSTAGRAM_RAPIDAPI_KEY;

  if (rapidApiKey && !rapidApiKey.includes("your-rapidapi")) {
    const rapidHosts = [
      process.env.RAPIDAPI_HOST,
      "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com",
      "social-media-video-downloader.p.rapidapi.com",
      "instagram-reels-download.p.rapidapi.com",
    ].filter(Boolean) as string[];

    for (const host of rapidHosts) {
      if (foundVideoUrl) break;
      try {
        let endpoint = "";
        if (host.includes("stories-videos4")) {
          endpoint = `https://${host}/convert?url=${encodeURIComponent(canonicalUrl)}`;
        } else if (host === "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com") {
          endpoint = `https://${host}/index?url=${encodeURIComponent(canonicalUrl)}`;
        } else if (host === "social-media-video-downloader.p.rapidapi.com") {
          endpoint = `https://${host}/smvd/get/instagram?url=${encodeURIComponent(canonicalUrl)}`;
        } else if (host === "instagram-reels-download.p.rapidapi.com") {
          endpoint = `https://${host}/reel?url=${encodeURIComponent(canonicalUrl)}`;
        } else {
          endpoint = `https://${host}/convert?url=${encodeURIComponent(canonicalUrl)}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const rapidRes = await fetch(endpoint, {
          method: "GET",
          headers: {
            "x-rapidapi-key": rapidApiKey,
            "x-rapidapi-host": host,
            Accept: "application/json",
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (rapidRes.ok) {
          const json = await rapidRes.json().catch(() => null);
          if (json) {
            // Check for direct video URL across different API response schemas
            let candidateVideo: string | undefined;

            if (Array.isArray(json.media) && json.media.length > 0) {
              const videoItem = json.media.find((m: any) => m.type === "video") || json.media[0];
              candidateVideo = videoItem.url || videoItem.media || videoItem.download_url || videoItem.thumbnail;
            }

            if (!candidateVideo) {
              candidateVideo =
                json.media ||
                json.url ||
                json.video ||
                json.video_url ||
                json.download_url ||
                json.data?.video ||
                json.data?.url ||
                json.data?.media ||
                json.data?.download_url ||
                json.links?.[0]?.link ||
                json.result?.[0]?.url;
            }

            if (typeof candidateVideo === "string" && candidateVideo.startsWith("http")) {
              foundVideoUrl = candidateVideo;
            }

            const candidateCaption =
              json.title ||
              json.caption ||
              json.description ||
              json.data?.title ||
              json.data?.caption;

            if (typeof candidateCaption === "string" && candidateCaption.trim().length > 5) {
              foundCaption = candidateCaption.trim();
            }
          }
        }
      } catch (rapidErr: any) {
        console.warn(`RapidAPI attempt failed for host ${host}:`, rapidErr.message);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Provider 2: Instagram Embed Caption Scraper (Fallback for metadata)
  // --------------------------------------------------------------------------
  if (!foundCaption || !foundVideoUrl) {
    try {
      const embedUrl = `https://www.instagram.com/${postType || "reel"}/${postId}/embed/captioned/`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(embedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: controller.signal,
        next: { revalidate: 0 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // Extract caption from embed
        if (!foundCaption) {
          const captionMatch =
            html.match(/<div class="Caption">([\s\S]*?)<\/div>/i) ||
            html.match(/class="CaptionText">([\s\S]*?)<\/span>/i);

          if (captionMatch && captionMatch[1]) {
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
        }

        // Check for video_url in script state if still missing
        if (!foundVideoUrl) {
          const videoMatch =
            html.match(/video_url\\":\\"([^"\\]+)/) ||
            html.match(/"video_url":"([^"]+)"/);
          if (videoMatch && videoMatch[1]) {
            foundVideoUrl = videoMatch[1].replace(/\\u0026/g, "&");
          }
        }
      }
    } catch (err: any) {
      console.warn("Instagram embed fetch warning:", err.message);
    }
  }

  // --------------------------------------------------------------------------
  // Step 3: If we have a video URL, download stream into memory for Gemini (up to 25MB)
  // --------------------------------------------------------------------------
  if (foundVideoUrl) {
    try {
      const vidController = new AbortController();
      const vidTimeout = setTimeout(() => vidController.abort(), 12000);

      const vidRes = await fetch(foundVideoUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: vidController.signal,
      });
      clearTimeout(vidTimeout);

      if (vidRes.ok) {
        const arrayBuf = await vidRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // Ensure within Gemini 25MB inline processing limit
        if (buffer.length > 0 && buffer.length <= 25 * 1024 * 1024) {
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

  // Return whatever metadata we were able to extract
  return {
    success: Boolean(foundCaption || foundVideoUrl),
    caption: foundCaption,
    videoUrl: foundVideoUrl,
  };
}
