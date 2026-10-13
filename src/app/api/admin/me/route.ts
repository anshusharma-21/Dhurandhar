import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export async function GET() {
  const auth = await verifyAdminAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return NextResponse.json({
    user: auth.user,
    profile: auth.profile,
    isAdmin: auth.isAdmin,
    isEditor: auth.isEditor,
    isModerator: auth.isModerator,
  });
}
