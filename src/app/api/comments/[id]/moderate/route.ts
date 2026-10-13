import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!auth.isModerator) {
      return NextResponse.json(
        { error: "Forbidden. Moderator, editor, or administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { status } = body;
    const moderatorId = auth.user.id;

    if (!["approved", "rejected", "spam", "removed"].includes(status)) {
      return NextResponse.json({ error: "Invalid comment status" }, { status: 400 });
    }

    const updated = await dbRepository.moderateComment(
      params.id,
      status,
      moderatorId
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
