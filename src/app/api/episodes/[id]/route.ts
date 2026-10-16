import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbRepository } from "@/lib/db/repository";
import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

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
    // Server-side authorization check (Editor / Admin only)
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!auth.isEditor) {
      return NextResponse.json(
        { error: "Forbidden. Editor or administrator privileges required to update episodes." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));

    if (body.instagram_url) {
      const igValidation = validateAndCleanInstagramUrl(body.instagram_url);
      if (!igValidation.isValid) {
        return NextResponse.json({ error: igValidation.errorMessage }, { status: 400 });
      }
      body.instagram_url = igValidation.canonicalUrl;
    }

    const updated = await dbRepository.updateEpisode(params.id, body);
    try {
      revalidatePath("/");
      revalidatePath("/episodes");
      if (updated?.slug) {
        revalidatePath(`/episodes/${updated.slug}`);
      }
    } catch {}
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
