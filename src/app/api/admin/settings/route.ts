import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.isAuthenticated || (!auth.isAdmin && !auth.isEditor)) {
      return NextResponse.json(
        { error: "Forbidden. Administrator or Editor privileges required." },
        { status: 403 }
      );
    }

    const settings = await dbRepository.getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch site settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Only administrators can modify system settings." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { canonical_hostname, display_timezone, contact_email, ai_provider, email_provider } = body;

    if (!display_timezone || typeof display_timezone !== "string") {
      return NextResponse.json({ error: "Display timezone is required." }, { status: 400 });
    }

    if (!contact_email || !contact_email.includes("@")) {
      return NextResponse.json({ error: "A valid contact email is required." }, { status: 400 });
    }

    if (ai_provider && !["gemini", "openai", "anthropic", "mock"].includes(ai_provider)) {
      return NextResponse.json({ error: "Invalid AI provider specified." }, { status: 400 });
    }

    if (email_provider && !["resend", "smtp", "mock"].includes(email_provider)) {
      return NextResponse.json({ error: "Invalid email provider specified." }, { status: 400 });
    }

    const updated = await dbRepository.updateSiteSettings(
      {
        canonical_hostname: canonical_hostname || "https://projectdhurandhar.automationlabs.online",
        display_timezone: display_timezone.trim(),
        contact_email: contact_email.trim(),
        ai_provider: ai_provider || "gemini",
        email_provider: email_provider || "resend",
      },
      auth.user.id
    );

    return NextResponse.json({
      success: true,
      message: "Site settings updated and persisted successfully.",
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save site settings." },
      { status: 500 }
    );
  }
}
