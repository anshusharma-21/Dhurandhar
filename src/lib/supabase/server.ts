import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl && 
  serviceRoleKey && 
  !supabaseUrl.includes("your-project") &&
  !serviceRoleKey.includes("your-supabase")
);

export const isServerPublicConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project") &&
  !supabaseAnonKey.includes("your-supabase")
);

/**
 * Creates an SSR-compliant Supabase client configured for Next.js App Router cookies.
 * Respects user session and Row Level Security (RLS) policies.
 */
export function createSupabaseServerClient() {
  if (!isServerPublicConfigured) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Server client using the Service Role Key.
 * Bypasses RLS for administrative background operations (e.g. system audit logging, telemetry, migrations).
 * NEVER expose this to client components.
 */
export const getSupabaseServerClient = () => {
  if (!isServerSupabaseConfigured) {
    return null;
  }
  return createSupabaseClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export const getSupabaseAdminClient = getSupabaseServerClient;
