import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";
import { sanitizePlainText } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await dbRepository.getFounderProfile();
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load founder profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.isAuthenticated || (!auth.isAdmin && !auth.isEditor)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin or Editor privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, title, bio, photo_url, company_name, company_url } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Founder name is required." },
        { status: 400 }
      );
    }

    const updated = await dbRepository.updateFounderProfile({
      name: sanitizePlainText(name).slice(0, 100),
      title: title ? sanitizePlainText(title).slice(0, 150) : undefined,
      bio: bio ? sanitizePlainText(bio).slice(0, 2000) : undefined,
      photo_url: typeof photo_url === "string" ? photo_url.trim() : photo_url || "",
      company_name: company_name ? sanitizePlainText(company_name).slice(0, 100) : undefined,
      company_url: company_url ? company_url.trim() : undefined,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update founder profile" },
      { status: 500 }
    );
  }
}
