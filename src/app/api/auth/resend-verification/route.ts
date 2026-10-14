import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, isServerPublicConfigured } from "@/lib/supabase/server";

// In-memory rate limiting map: identifier (email or IP) -> timestamp of last request
const rateLimitMap = new Map<string, number>();
const COOLDOWN_SECONDS = 60;

function checkRateLimit(key: string): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const lastTime = rateLimitMap.get(key);
  if (!lastTime) {
    rateLimitMap.set(key, now);
    return { allowed: true, remainingSeconds: 0 };
  }

  const elapsedSeconds = Math.floor((now - lastTime) / 1000);
  if (elapsedSeconds < COOLDOWN_SECONDS) {
    return { allowed: false, remainingSeconds: COOLDOWN_SECONDS - elapsedSeconds };
  }

  rateLimitMap.set(key, now);
  return { allowed: true, remainingSeconds: 0 };
}

// Periodically clean up old rate-limit entries (older than 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 600000;
    rateLimitMap.forEach((timestamp, key) => {
      if (timestamp < cutoff) {
        rateLimitMap.delete(key);
      }
    });
  }, 300000);
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    if (!isServerPublicConfigured) {
      return NextResponse.json(
        { error: "Authentication service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Authentication service is currently unavailable." },
        { status: 503 }
      );
    }

    // 1. Check if caller has an authenticated session
    let targetEmail: string | null = null;
    let isAuthenticated = false;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && user.email) {
      isAuthenticated = true;
      targetEmail = user.email.toLowerCase().trim();

      // If user is already verified, inform them immediately
      if (user.email_confirmed_at) {
        return NextResponse.json({
          success: true,
          alreadyVerified: true,
          message: "Your email address is already verified. You can post comments freely.",
        });
      }
    }

    // 2. If not authenticated, read email from request body
    if (!targetEmail) {
      const body = await req.json().catch(() => null);
      if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
        return NextResponse.json(
          { error: "Please provide a valid email address." },
          { status: 400 }
        );
      }
      targetEmail = body.email.toLowerCase().trim();
    }

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const emailToSend: string = targetEmail;

    // 3. Enforce 60-second cooldown rate limit per email and per IP
    const emailLimit = checkRateLimit(`email:${emailToSend}`);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${emailLimit.remainingSeconds} seconds before requesting another verification email.`,
        },
        { status: 429 }
      );
    }

    const ipLimit = checkRateLimit(`ip:${ip}`);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${ipLimit.remainingSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 4. Determine redirect URL
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://projectdhurandhar.automationlabs.online";

    const emailRedirectTo = `${origin}/auth/callback`;

    // 5. Trigger Supabase verification email resend
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: emailToSend,
      options: {
        emailRedirectTo,
      },
    });

    if (resendError) {
      // Handle Supabase internal rate limit gracefully
      if (
        resendError.status === 429 ||
        resendError.message?.toLowerCase().includes("rate limit") ||
        resendError.message?.toLowerCase().includes("security purposes")
      ) {
        return NextResponse.json(
          {
            error:
              "For security purposes, you can only request this once every 60 seconds. Please check your inbox or wait before retrying.",
          },
          { status: 429 }
        );
      }

      // If Supabase reports user not found or unconfirmed disabled, do not leak user existence for unauthenticated callers
      if (!isAuthenticated) {
        return NextResponse.json({
          success: true,
          message:
            "If an account exists for this email address, a verification link has been sent. Please check your inbox and spam folder.",
        });
      }

      return NextResponse.json(
        { error: resendError.message || "Failed to send verification email." },
        { status: 400 }
      );
    }

    // 6. Generic success message preventing email enumeration
    return NextResponse.json({
      success: true,
      message: isAuthenticated
        ? `A fresh verification link has been sent to ${targetEmail}. Please check your inbox and spam folder.`
        : "If an account exists for this email address, a verification link has been sent. Please check your inbox and spam folder.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while sending verification email." },
      { status: 500 }
    );
  }
}
