import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { createSupabaseServerClient, isServerPublicConfigured } from "@/lib/supabase/server";
import { sendCommentModerationAlert } from "@/lib/email/service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const episodeId = searchParams.get("episodeId");

    if (!episodeId) {
      return NextResponse.json({ error: "episodeId parameter is required" }, { status: 400 });
    }

    const comments = await dbRepository.getApprovedComments(episodeId);
    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON request payload." }, { status: 400 });
    }

    if (!body.episode_id || typeof body.episode_id !== "string") {
      return NextResponse.json({ error: "Episode ID is required." }, { status: 400 });
    }

    if (!body.body || typeof body.body !== "string" || !body.body.trim()) {
      return NextResponse.json({ error: "Comment text cannot be empty." }, { status: 400 });
    }

    let authorName = "Community Member";

    if (!isServerPublicConfigured) {
      return NextResponse.json(
        { error: "Authentication service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication service is currently unavailable." },
        { status: 503 }
      );
    }

    // Securely derive authenticated user from server session / cookies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to participate in discussion." },
        { status: 401 }
      );
    }

    // Check email verification from Supabase auth user
    let isEmailVerified = Boolean(user.email_confirmed_at);

    // Check public.profiles record for status and display name
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, role, status, email_verified_at")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        if (profile.status === "suspended" || profile.status === "deleted") {
          return NextResponse.json(
            { error: "Account suspended or deactivated. Commenting is disabled." },
            { status: 403 }
          );
        }
        if (profile.email_verified_at) {
          isEmailVerified = true;
        }
        if (profile.display_name) {
          authorName = profile.display_name;
        }
      }
    } catch {
      // Fall back to user metadata if profiles query fails
    }

    if (authorName === "Community Member") {
      authorName =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Community Member";
    }

    // Prevent impersonation: authorId is strictly derived from authenticated session user
    const authorId = user.id;

    // Persist comment via repository (resolves episode ID/UUID, checks first-time moderation, persists to Supabase)
    const comment = await dbRepository.createComment({
      episode_id: body.episode_id,
      author_profile_id: authorId,
      author_name: authorName,
      body: body.body,
    });

    // If comment is placed in pending moderation queue, notify moderators (non-blocking)
    if (comment.status === "pending") {
      sendCommentModerationAlert({
        commentId: comment.id,
        authorName,
        episodeTitle: `Episode ${body.episode_id}`,
        commentBody: comment.body,
      }).catch((err) => {
        console.warn("Moderation alert notification error:", err.message);
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit comment." }, { status: 400 });
  }
}
