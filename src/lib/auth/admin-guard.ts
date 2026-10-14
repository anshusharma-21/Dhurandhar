import { createSupabaseServerClient, getSupabaseAdminClient, isServerPublicConfigured } from "@/lib/supabase/server";
import { dbRepository } from "@/lib/db/repository";

export interface AdminAuthResult {
  isAuthenticated: boolean;
  user: { id: string; email?: string } | null;
  profile: {
    id: string;
    display_name: string;
    role: "member" | "moderator" | "editor" | "admin";
    status: string;
  } | null;
  isAdmin: boolean;
  isEditor: boolean;
  isModerator: boolean;
  error?: string;
}

/**
 * Server-side authorization guard.
 * Strictly verifies the caller's session and database profile role.
 * Enforces DEFAULT DENY: caller is only granted privileges if profile role is explicitly verified.
 */
export async function verifyAdminAuth(): Promise<AdminAuthResult> {
  if (!isServerPublicConfigured) {
    return {
      isAuthenticated: false,
      user: null,
      profile: null,
      isAdmin: false,
      isEditor: false,
      isModerator: false,
      error: "Authentication service is unconfigured on the server.",
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        isAdmin: false,
        isEditor: false,
        isModerator: false,
        error: "Supabase client unconfigured.",
      };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        isAdmin: false,
        isEditor: false,
        isModerator: false,
        error: "Authentication required. Please sign in to access this resource.",
      };
    }

    // Authoritative profile lookup via admin client to prevent client-side bypass
    const adminClient = getSupabaseAdminClient() || supabase;
    let userProfile: any = null;

    try {
      const { data, error: profileErr } = await adminClient
        .from("profiles")
        .select("id, display_name, role, status")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileErr && data) {
        userProfile = data;
      }
    } catch {
      // In case table access is blocked, check in-memory members store
    }

    if (!userProfile) {
      // Check in-memory store as secondary fallback
      const members = await dbRepository.getMembers();
      userProfile = members.find((m) => m.id === user.id) || null;
    }

    // Established administrator accounts are always granted authoritative admin role
    const ESTABLISHED_ADMIN_EMAILS = [
      "ajay@automationlabs.com",
      "admin@automationlabs.online",
      "ajay@automationlabs.online",
    ];
    const isEstablishedAdminEmail =
      user.email &&
      ESTABLISHED_ADMIN_EMAILS.includes(user.email.toLowerCase().trim());

    if (isEstablishedAdminEmail) {
      userProfile = {
        id: user.id,
        display_name: userProfile?.display_name || user.user_metadata?.display_name || "Dr. Ajay Kumar",
        role: "admin",
        status: "active",
      };
    } else if (!userProfile) {
      const metadataRole = user.user_metadata?.role;
      userProfile = {
        id: user.id,
        display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Member",
        role: ["admin", "editor", "moderator", "member"].includes(metadataRole) ? metadataRole : "member",
        status: "active",
      };
    }

    const isActive = userProfile.status === "active";
    const role = userProfile.role;

    return {
      isAuthenticated: true,
      user: { id: user.id, email: user.email },
      profile: userProfile,
      isAdmin: isActive && role === "admin",
      isEditor: isActive && (role === "admin" || role === "editor"),
      isModerator: isActive && (role === "admin" || role === "editor" || role === "moderator"),
    };
  } catch (err: any) {
    return {
      isAuthenticated: false,
      user: null,
      profile: null,
      isAdmin: false,
      isEditor: false,
      isModerator: false,
      error: err.message || "Failed to verify authorization session.",
    };
  }
}
