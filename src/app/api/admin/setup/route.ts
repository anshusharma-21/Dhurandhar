import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { dbRepository } from "@/lib/db/repository";

// In-memory setup mutex to guard against concurrent setup attempts
let isSetupInProgress = false;

async function checkAdminExists(): Promise<boolean> {
  const adminClient = getSupabaseAdminClient();
  if (adminClient && isServerSupabaseConfigured) {
    try {
      // 1. Check profiles table for active admin
      const { data, error } = await adminClient
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .eq("status", "active")
        .limit(1);

      if (!error && data && data.length > 0) {
        return true;
      }

      // 2. Check auth.users metadata for role === 'admin'
      const { data: usersData, error: userErr } = await adminClient.auth.admin.listUsers();
      if (!userErr && usersData?.users) {
        const hasAdminUser = usersData.users.some(
          (u) => u.user_metadata?.role === "admin"
        );
        if (hasAdminUser) return true;
      }

      return false;
    } catch {
      // Fallback to checking store
    }
  }

  // In offline dev mode (Supabase unconfigured), check repository
  const members = await dbRepository.getMembers();
  return members.some((m) => m.role === "admin" && m.status === "active" && !m.id.startsWith("admin-1"));
}

export async function GET() {
  const adminExists = await checkAdminExists();
  return NextResponse.json({
    adminExists,
    setupLocked: adminExists,
  });
}

export async function POST(req: NextRequest) {
  if (isSetupInProgress) {
    return NextResponse.json(
      { error: "Setup request is currently being processed. Please wait." },
      { status: 429 }
    );
  }

  isSetupInProgress = true;

  try {
    // 1. Strict server-side verification: reject if an administrator already exists
    const adminExists = await checkAdminExists();
    if (adminExists) {
      return NextResponse.json(
        {
          error:
            "Setup is permanently locked: An administrator account has already been initialized for Project Dhurandhar.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password, displayName } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }
    if (!displayName || displayName.trim().length < 2) {
      return NextResponse.json({ error: "Display name must be at least 2 characters long." }, { status: 400 });
    }

    const adminClient = getSupabaseAdminClient();
    let userId: string = `admin-${Date.now()}`;

    if (adminClient && isServerSupabaseConfigured) {
      // Check if user already exists in auth
      const { data: listData } = await adminClient.auth.admin.listUsers();
      const existingUser = listData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase().trim());

      if (existingUser) {
        userId = existingUser.id;
        // Promote existing user to administrator and confirm email
        await adminClient.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
          user_metadata: {
            display_name: displayName.trim(),
            role: "admin",
          },
        });
      } else {
        // Create new confirmed administrator user
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email: email.trim(),
          password,
          email_confirm: true,
          user_metadata: {
            display_name: displayName.trim(),
            role: "admin",
          },
        });

        if (createError) {
          throw new Error(createError.message);
        }
        if (newUser?.user) {
          userId = newUser.user.id;
        }
      }

      // Upsert public.profiles record
      try {
        await adminClient.from("profiles").upsert(
          {
            id: userId,
            display_name: displayName.trim(),
            role: "admin",
            status: "active",
            email_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (profileErr: any) {
        console.warn("Could not upsert profile row in Supabase:", profileErr.message);
      }
    }

    // Always update in-memory members store for seamless offline / test compatibility
    const members = await dbRepository.getMembers();
    const existingMemberIdx = members.findIndex((m) => m.id === userId || m.display_name === displayName);

    if (existingMemberIdx >= 0) {
      members[existingMemberIdx].role = "admin";
      members[existingMemberIdx].status = "active";
    } else {
      members.unshift({
        id: userId,
        display_name: displayName.trim(),
        role: "admin",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "First administrator successfully initialized. Setup is now permanently locked.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to initialize administrator." }, { status: 500 });
  } finally {
    isSetupInProgress = false;
  }
}
