import { NextRequest, NextResponse } from "next/server";
import { generateAutoFillEpisode } from "@/lib/ai/service";
import { extractInstagramMedia } from "@/lib/ai/extractor";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { AutoFillRequest } from "@/lib/types/ai";
import { syncEpisodeVideoToStorage } from "@/lib/storage/video-sync";

export const maxDuration = 60; // Allow 60 seconds for audio analysis

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization guard
    const auth = await verifyAdminAuth();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json(
        { error: "Authentication required to generate AI episode details." },
        { status: 401 }
      );
    }

    if (!auth.isEditor && !auth.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Editor or administrator privileges required." },
        { status: 403 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let dayNumber = 1;
    let episodeTitle: string | undefined;
    let instagramUrl: string | undefined;
    let mediaBase64: string | undefined;
    let mimeType: string | undefined;
    let captionText: string | undefined;
    let transcriptText: string | undefined;
    let contextNotes: string | undefined;
    let availableTags: Array<{ id: string; label: string; slug: string }> = [];

    // 2. Parse request based on Content-Type
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      dayNumber = Number(formData.get("dayNumber")) || 1;
      episodeTitle = (formData.get("episodeTitle") as string) || undefined;
      instagramUrl = (formData.get("instagramUrl") as string) || undefined;
      captionText = (formData.get("captionText") as string) || undefined;
      transcriptText = (formData.get("transcriptText") as string) || undefined;
      contextNotes = (formData.get("contextNotes") as string) || undefined;

      const tagsJson = formData.get("availableTags") as string;
      if (tagsJson) {
        try {
          availableTags = JSON.parse(tagsJson);
        } catch {
          // ignore tag parse error
        }
      }

      const file = formData.get("mediaFile") as File | null;
      if (file && file.size > 0) {
        if (file.size > 25 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Media file too large. Please upload audio or video under 25MB." },
            { status: 400 }
          );
        }
        const arrayBuf = await file.arrayBuffer();
        mediaBase64 = Buffer.from(arrayBuf).toString("base64");
        mimeType = file.type || "audio/mp3";
      }
    } else {
      const body = await req.json().catch(() => ({}));
      dayNumber = Number(body.dayNumber) || 1;
      episodeTitle = body.episodeTitle;
      instagramUrl = body.instagramUrl;
      mediaBase64 = body.mediaBase64;
      mimeType = body.mimeType;
      captionText = body.captionText;
      transcriptText = body.transcriptText;
      contextNotes = body.contextNotes;
      availableTags = body.availableTags || [];
    }

    // 3. If Instagram URL provided and no media attached, attempt extraction
    let linkExtractionNotice: string | undefined;
    if (instagramUrl && !mediaBase64) {
      try {
        const extracted = await extractInstagramMedia(instagramUrl);
        if (extracted.caption && !captionText) {
          captionText = extracted.caption;
        }
        if (extracted.mediaBase64) {
          mediaBase64 = extracted.mediaBase64;
          mimeType = extracted.mimeType || "video/mp4";
        }
        if (extracted.error) {
          linkExtractionNotice = extracted.error;
        }
      } catch (extractErr: any) {
        console.warn("Instagram extraction non-fatal error:", extractErr.message);
        linkExtractionNotice = extractErr.message;
      }
    }

    // Safeguard against hallucination: ensure at least one real source material exists
    const hasMedia = Boolean(mediaBase64);
    const hasTranscript = Boolean(transcriptText && transcriptText.trim().length >= 10);
    const hasCaption = Boolean(captionText && captionText.trim().length >= 15);
    const hasNotes = Boolean(contextNotes && contextNotes.trim().length >= 10);

    if (!hasMedia && !hasTranscript && !hasCaption && !hasNotes) {
      return NextResponse.json(
        {
          error:
            "Could not automatically fetch the Reel audio from Instagram due to Meta access restrictions. To generate an accurate episode without guessing, please either add RAPIDAPI_KEY to your .env.local, click 'Upload Reel' to select the video file directly, or provide a brief transcript/context.",
        },
        { status: 422 }
      );
    }

    // 4. Generate with Gemini
    const autoFillPayload: AutoFillRequest = {
      dayNumber,
      episodeTitle,
      instagramUrl,
      mediaBase64,
      mimeType,
      captionText,
      transcriptText,
      contextNotes,
      availableTags,
    };

    const result = await generateAutoFillEpisode(autoFillPayload);

    // Automatically sync high-definition video into Supabase Storage in the background
    if (dayNumber) {
      syncEpisodeVideoToStorage(Number(dayNumber), instagramUrl || "", mediaBase64).catch((err) =>
        console.warn("Auto-fill background video sync error:", err.message)
      );
    }

    // 5. Persist telemetry into Supabase ai_jobs table for audit & operations visibility
    let loggedJobId: string | undefined;
    try {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        const { data: jobData, error: jobErr } = await adminClient
          .from("ai_jobs")
          .insert({
            model: result.model || "gemini-flash-latest",
            source_types: [result.sourceType || "transcription"],
            status: "completed",
            tokens_used: result.tokensUsed || 500,
            cost_estimate: (result.tokensUsed || 500) * 0.00000015,
            completed_at: new Date().toISOString(),
          })
          .select("id")
          .maybeSingle();

        if (jobData?.id) {
          loggedJobId = jobData.id;
        }
      }
    } catch (jobErr: any) {
      console.warn("Non-fatal ai_jobs telemetry logging error:", jobErr.message);
    }

    return NextResponse.json({
      ...result,
      jobId: loggedJobId,
      summaryStatus: "approved",
      summarySource: result.sourceType || "transcription",
      linkExtractionNotice,
    });
  } catch (err: any) {
    console.error("Auto-fill API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to auto-generate episode content." },
      { status: 500 }
    );
  }
}
