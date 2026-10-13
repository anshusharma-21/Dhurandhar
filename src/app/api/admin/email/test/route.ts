import { NextRequest, NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/email/service";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const testRecipient = body.to || auth.user.email || "admin@automationlabs.online";

    const result = await sendTransactionalEmail({
      to: testRecipient,
      subject: "Project Dhurandhar: Test Verification Email",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0b1120; color: #fff; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Transactional Email Verification Successful</h2>
          <p>This is a live test notification from your Project Dhurandhar control console.</p>
          <p style="color: #94a3b8; font-size: 12px;">Dispatched at: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      result,
      recipient: testRecipient,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
