import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: "Admin client unconfigured." }, { status: 500 });
    }

    // List users to find by email
    const { data, error } = await adminClient.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data.users.find((u) => u.email?.toLowerCase() === email);
    if (user) {
      await adminClient.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });

      // Also update profiles table
      try {
        await adminClient
          .from("profiles")
          .update({ email_verified_at: new Date().toISOString() })
          .eq("id", user.id);
      } catch {
        // Non-blocking
      }

      return NextResponse.json({ success: true, confirmed: true });
    }

    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
