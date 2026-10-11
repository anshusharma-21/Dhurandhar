import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const episode = await dbRepository.getEpisodeById(params.id);
    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }
    return NextResponse.json(episode);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (body.instagram_url) {
      const igValidation = validateAndCleanInstagramUrl(body.instagram_url);
      if (!igValidation.isValid) {
        return NextResponse.json({ error: igValidation.errorMessage }, { status: 400 });
      }
      body.instagram_url = igValidation.canonicalUrl;
    }

    const updated = await dbRepository.updateEpisode(params.id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
