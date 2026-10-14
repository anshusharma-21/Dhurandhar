import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { dbRepository } from "@/lib/db/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const displayName = body.displayName?.trim();

    if (!displayName) {
      return NextResponse.json({ error: "Display name is required." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const adminClient = getSupabaseAdminClient();

    if (adminClient) {
      // Create user directly with email_confirm = true so NO verification email is needed
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: displayName,
          role: "member",
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
          return NextResponse.json(
            { error: "An account with this email address already exists. Please sign in instead." },
            { status: 400 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (data?.user) {
        // Create user profile in profiles table
        try {
          await adminClient.from("profiles").upsert({
            id: data.user.id,
            display_name: displayName,
            role: "member",
            status: "active",
            email_verified_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        } catch {
          // Non-blocking
        }

        // Also track in repository
        try {
          await dbRepository.createMember({
            id: data.user.id,
            display_name: displayName,
            role: "member",
            status: "active",
          });
        } catch {
          // Non-blocking
        }

        return NextResponse.json({
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            displayName,
          },
        });
      }
    }

    return NextResponse.json(
      { error: "Authentication service is unconfigured on the server." },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create account." }, { status: 500 });
  }
}
