import { NextRequest, NextResponse } from "next/server";
import { generateAISummary } from "@/lib/ai/service";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { dbRepository } from "@/lib/db/repository";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export async function POST(req: NextRequest) {
  try {
    // Server-side authorization check (Admins and Editors only)
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json(
        { error: "Authentication required to generate AI summaries." },
        { status: 401 }
      );
    }

    if (!auth.isEditor) {
      return NextResponse.json(
        { error: "Forbidden. Editor or administrator privileges required to generate AI summaries." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));

    if (!body.episodeTitle || !body.dayNumber) {
      return NextResponse.json(
        { error: "Episode title and day number are required." },
        { status: 400 }
      );
    }

    const aiResult = await generateAISummary({
      episodeTitle: body.episodeTitle,
      dayNumber: Number(body.dayNumber),
      transcriptText: body.transcriptText,
      captionText: body.captionText,
      contextNotes: body.contextNotes,
      tags: body.tags,
    });

    // Persist telemetry into Supabase ai_jobs table if Supabase is active
    try {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        await adminClient.from("ai_jobs").insert({
          episode_id: body.episodeId || null,
          model: aiResult.model,
          source_types: [aiResult.sourceType],
          status: "completed",
          tokens_used: aiResult.tokensUsed || 0,
          cost_estimate: (aiResult.tokensUsed || 0) * 0.00000015,
          completed_at: new Date().toISOString(),
        });
      }
    } catch {
      // Non-blocking telemetry
    }

    // Auto-persist directly to episode if requested
    if (body.autoPersist && body.episodeId) {
      try {
        await dbRepository.updateEpisode(body.episodeId, {
          summary: aiResult.summary,
          takeaways: aiResult.takeaways,
          summary_status: "generated",
          summary_source: aiResult.sourceType,
        });
      } catch (persistErr: any) {
        console.warn("Could not auto-persist AI summary to episode:", persistErr.message);
      }
    }

    return NextResponse.json(aiResult);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate AI summary." },
      { status: 400 }
    );
  }
}
