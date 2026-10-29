import { getSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Automatically fetches the Instagram Reel video stream and permanently
 * uploads it to Supabase Storage as `videos/day-${dayNumber}.mp4`.
 * Ensures high-definition native playback everywhere (localhost + live domain)
 * without third-party iframe blocks or login walls.
 */
export async function syncEpisodeVideoToStorage(
  dayNumber: number,
  instagramUrl: string
): Promise<string | null> {
  if (!dayNumber || dayNumber <= 0 || !instagramUrl) {
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

    // 2. Fetch direct video stream URL using configured RapidAPI credentials
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
      "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com";

    const endpoint = `https://${host}/convert?url=${encodeURIComponent(instagramUrl)}`;

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

    if (!apiRes.ok) {
      console.warn(`RapidAPI video sync request returned status ${apiRes.status}`);
      return null;
    }

    const json = await apiRes.json();
    let downloadUrl: string | undefined;

    if (Array.isArray(json.media) && json.media.length > 0) {
      const videoItem = json.media.find((m: any) => m.type === "video") || json.media[0];
      downloadUrl = videoItem.url || videoItem.media || videoItem.download_url;
    }

    if (!downloadUrl) {
      downloadUrl =
        json.media ||
        json.url ||
        json.video ||
        json.video_url ||
        json.download_url ||
        json.data?.video ||
        json.data?.url;
    }

    if (!downloadUrl || typeof downloadUrl !== "string") {
      console.warn(`Could not resolve downloadable MP4 stream for Day ${dayNumber}`);
      return null;
    }

    // 3. Download the MP4 stream
    const vidRes = await fetch(downloadUrl);
    if (!vidRes.ok) {
      console.warn(`Failed to fetch MP4 stream from CDN for Day ${dayNumber}: ${vidRes.status}`);
      return null;
    }

    const arrayBuf = await vidRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    if (buffer.length < 50000) {
      console.warn(`Downloaded video buffer too small (${buffer.length} bytes) for Day ${dayNumber}`);
      return null;
    }

    // 4. Upload to Supabase Storage with public access
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
