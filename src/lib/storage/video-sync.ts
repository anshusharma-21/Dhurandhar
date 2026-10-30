import { getSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Automatically fetches the Instagram Reel video stream and permanently
 * uploads it to Supabase Storage as `videos/day-${dayNumber}.mp4`.
 * Ensures high-definition native playback everywhere (localhost + live domain)
 * without third-party iframe blocks or login walls.
 */
export async function syncEpisodeVideoToStorage(
  dayNumber: number,
  instagramUrl: string,
  existingBufferOrBase64?: Buffer | string
): Promise<string | null> {
  if (!dayNumber || dayNumber <= 0) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.warn("Supabase admin client not configured for video sync");
    return null;
  }

  const filename = `videos/day-${dayNumber}.mp4`;
  const publicUrl = `https://cswqqbyvrqyclcnikiuu.supabase.co/storage/v1/object/public/media/${filename}`;

  try {
    // 1. Check if video file already exists in Supabase storage
    const { data: existingFiles } = await supabase.storage
      .from("media")
      .list("videos", { search: `day-${dayNumber}.mp4` });

    const exists = existingFiles?.some(
      (f) => f.name === `day-${dayNumber}.mp4` && (f.metadata?.size || 0) > 10000
    );
    if (exists) {
      return publicUrl;
    }

    let buffer: Buffer | null = null;

    // A. Use existing downloaded buffer if provided (fastest, zero extra API calls)
    if (existingBufferOrBase64) {
      if (Buffer.isBuffer(existingBufferOrBase64)) {
        buffer = existingBufferOrBase64;
      } else if (typeof existingBufferOrBase64 === "string" && existingBufferOrBase64.length > 100) {
        buffer = Buffer.from(existingBufferOrBase64, "base64");
      }
    }

    // B. If no buffer provided yet, fetch from RapidAPI using working endpoint
    if (!buffer && instagramUrl) {
      const rapidApiKey =
        process.env.RAPIDAPI_KEY ||
        process.env.RAPID_API_KEY ||
        process.env.INSTAGRAM_RAPIDAPI_KEY;

      if (!rapidApiKey) {
        console.warn("RAPIDAPI_KEY not configured. Skipping automated video storage sync.");
        return null;
      }

      const host =
        process.env.RAPIDAPI_HOST ||
        "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com";

      let endpoint = "";
      if (host.includes("stories1")) {
        endpoint = `https://${host}/fetch?url=${encodeURIComponent(instagramUrl)}`;
      } else if (host.includes("stories-videos4")) {
        endpoint = `https://${host}/convert?url=${encodeURIComponent(instagramUrl)}`;
      } else {
        endpoint = `https://${host}/fetch?url=${encodeURIComponent(instagramUrl)}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const apiRes = await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": host,
          Accept: "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (apiRes.ok) {
        const json = await apiRes.json().catch(() => null);
        if (json) {
          let downloadUrl: string | undefined;

          if (Array.isArray(json.media) && json.media.length > 0) {
            const videoItem = json.media.find((m: any) => m.type === "video") || json.media[0];
            downloadUrl = videoItem.url || videoItem.media || videoItem.download_url;
          }

          if (!downloadUrl) {
            downloadUrl =
              json.download_url ||
              json.url ||
              json.video ||
              json.video_url ||
              json.result?.download_url ||
              json.data?.video ||
              json.data?.url ||
              json.data?.download_url;
          }

          if (downloadUrl && typeof downloadUrl === "string") {
            const vidRes = await fetch(downloadUrl);
            if (vidRes.ok) {
              const arrayBuf = await vidRes.arrayBuffer();
              buffer = Buffer.from(arrayBuf);
            }
          }
        }
      }
    }

    if (!buffer || buffer.length < 50000) {
      console.warn(`Could not resolve downloadable MP4 stream for Day ${dayNumber}`);
      return null;
    }

    // Upload to Supabase Storage with public access
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(filename, buffer, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (upErr) {
      console.error(`Failed to upload ${filename} to Supabase storage:`, upErr.message);
      return null;
    }

    console.log(`✨ Successfully synced Day ${dayNumber} video (${buffer.length} bytes) to Supabase Storage!`);
    return publicUrl;
  } catch (err: any) {
    console.warn(`Automated video sync error for Day ${dayNumber}:`, err.message);
    return null;
  }
}

