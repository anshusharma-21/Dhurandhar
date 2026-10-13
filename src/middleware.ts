import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin and its nested routes
  if (pathname.startsWith("/admin")) {
    const isAdminAuthRoute = pathname === "/admin/login" || pathname === "/admin/setup";
    const requestHeaders = new Headers(request.headers);

    if (isAdminAuthRoute) {
      requestHeaders.set("x-is-admin-auth", "true");
      const res = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      res.headers.set("x-is-admin-auth", "true");
      return res;
    }

    requestHeaders.delete("x-is-admin-auth");
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase credentials are not configured, allow local dev access
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
      return response;
    }

    // Inspect authenticated session cookies using SSR client
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: new Headers(request.headers),
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: new Headers(request.headers),
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If no active session or invalid token, redirect to dedicated Admin Login
    if (error || !user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    response.headers.set("x-admin-authenticated", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
