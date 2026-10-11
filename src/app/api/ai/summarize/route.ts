import { NextRequest, NextResponse } from "next/server";
import { generateAISummary } from "@/lib/ai/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    return NextResponse.json(aiResult);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate AI summary." },
      { status: 400 }
    );
  }
}
