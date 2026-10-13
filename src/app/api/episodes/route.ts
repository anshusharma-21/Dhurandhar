import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

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
    // Server-side authorization check (Editor / Admin only)
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json(
        { error: "Authentication required to publish or create episodes." },
        { status: 401 }
      );
    }

    if (!auth.isEditor) {
      return NextResponse.json(
        { error: "Forbidden. Editor or administrator privileges required to create episodes." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    body.created_by = auth.user.id;

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
