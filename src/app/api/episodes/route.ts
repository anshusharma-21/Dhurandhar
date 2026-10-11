import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const sort = (searchParams.get("sort") as any) || "newest";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;

    const result = await dbRepository.getPublishedEpisodes({
      query,
      tag,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch episodes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate Day Number
    if (!body.day_number || isNaN(Number(body.day_number))) {
      return NextResponse.json({ error: "Day Number is required and must be an integer." }, { status: 400 });
    }

    // Validate Instagram URL if provided
    if (body.instagram_url) {
      const igValidation = validateAndCleanInstagramUrl(body.instagram_url);
      if (!igValidation.isValid) {
        return NextResponse.json({ error: igValidation.errorMessage }, { status: 400 });
      }
      body.instagram_url = igValidation.canonicalUrl;
    }

    const created = await dbRepository.createEpisode(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create episode" }, { status: 400 });
  }
}
