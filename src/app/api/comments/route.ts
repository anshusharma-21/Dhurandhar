import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";

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
    const body = await req.json();

    // Verification check (AC-09, AC-10)
    if (!body.author_profile_id) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to participate in discussion." },
        { status: 401 }
      );
    }

    if (body.is_email_verified === false) {
      return NextResponse.json(
        { error: "Email verification required. Please verify your email before posting comments." },
        { status: 403 }
      );
    }

    if (!body.episode_id || !body.body) {
      return NextResponse.json({ error: "Episode ID and comment body are required." }, { status: 400 });
    }

    const comment = await dbRepository.createComment({
      episode_id: body.episode_id,
      author_profile_id: body.author_profile_id,
      author_name: body.author_name || "Community Member",
      body: body.body,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
