import { NextRequest, NextResponse } from "next/server";
import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";

  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const validation = validateAndCleanInstagramUrl(rawUrl);
  if (!validation.isValid || !validation.postId) {
    return new NextResponse("Invalid Instagram URL", { status: 400 });
  }

  try {
    const targetUrl = `https://www.instagram.com/p/${validation.postId}/media/?size=l`;
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch Instagram thumbnail", { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Error fetching thumbnail: ${err.message}`, { status: 500 });
  }
}
