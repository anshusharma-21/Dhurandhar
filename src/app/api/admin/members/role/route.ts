import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";
import { dbRepository } from "@/lib/db/repository";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Only active administrators can modify member roles." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { memberId, role } = body;

    if (!memberId || typeof memberId !== "string") {
      return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
    }

    if (!["member", "moderator", "editor", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    // Update in Supabase profiles table
    const adminClient = getSupabaseAdminClient();
    if (adminClient) {
      try {
        await adminClient
          .from("profiles")
          .update({ role, updated_at: new Date().toISOString() })
          .eq("id", memberId);
      } catch (err: any) {
        console.warn("Could not update role in Supabase:", err.message);
      }
    }

    // Update in-memory repository store
    const updated = await dbRepository.updateMemberRole(memberId, role);

    return NextResponse.json({
      success: true,
      member: updated,
      message: `Member role updated to ${role}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update member role." }, { status: 500 });
  }
}
