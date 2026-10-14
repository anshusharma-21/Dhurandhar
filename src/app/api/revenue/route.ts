import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedAdmin = searchParams.get("admin") === "true";
    let isAdmin = false;

    // Server-side authorization check for admin view
    if (requestedAdmin) {
      const auth = await verifyAdminAuth();
      if (auth.isAdmin) {
        isAdmin = true;
      }
    }

    const settings = await dbRepository.getRevenueSettings();
    const months = await dbRepository.getRevenueMonths(isAdmin);
    const milestones = await dbRepository.getMilestones();

    // AC-15 PRIVACY GUARD:
    // If dashboard visibility is set to private and request is not authorized admin,
    // do not expose monthly financial figures or internal actual values in the public payload.
    if (settings.visibility === "private" && !isAdmin) {
      return NextResponse.json({
        visibility: "private",
        message: "Revenue dashboard is currently set to private by the administrator.",
        settings: {
          goal_label: settings.goal_label,
          visibility: "private",
        },
        metrics: null,
        milestones: milestones.filter((m) => m.visibility),
      });
    }

    const metrics = calculateRevenueMetrics(settings, months);

    // If summary only, suppress detailed individual monthly breakdown
    if (settings.visibility === "public_summary" && !isAdmin) {
      return NextResponse.json({
        visibility: "public_summary",
        settings,
        metrics: {
          ...metrics,
          monthlyTrend: [], // Hidden in summary-only mode
        },
        milestones: milestones.filter((m) => m.visibility),
      });
    }

    return NextResponse.json({
      visibility: settings.visibility,
      settings,
      metrics,
      milestones: milestones.filter((m) => m.visibility || isAdmin),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Enforce administrator role on the server
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Administrator privileges required to alter financial records." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const actorId = auth.user.id;

    if (body.type === "settings") {
      const s = body.settings;
      if (!s || typeof s !== "object") {
        return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
      }

      const targetAmount = Number(s.target_amount);
      if (isNaN(targetAmount) || targetAmount <= 0) {
        return NextResponse.json({ error: "Target amount must be a positive number." }, { status: 400 });
      }

      if (s.target_basis && !["cumulative", "financial_year"].includes(s.target_basis)) {
        return NextResponse.json({ error: "Invalid target basis." }, { status: 400 });
      }

      if (s.revenue_definition && !["recognised", "invoiced", "cash_collected"].includes(s.revenue_definition)) {
        return NextResponse.json({ error: "Invalid revenue definition." }, { status: 400 });
      }

      if (s.gst_treatment && !["included", "excluded"].includes(s.gst_treatment)) {
        return NextResponse.json({ error: "Invalid GST treatment." }, { status: 400 });
      }

      if (s.visibility && !["public_detailed", "public_summary", "private"].includes(s.visibility)) {
        return NextResponse.json({ error: "Invalid visibility setting." }, { status: 400 });
      }

      const updated = await dbRepository.updateRevenueSettings(s, actorId);
      return NextResponse.json(updated);
    }

    if (body.type === "month") {
      const m = body.monthData;
      if (!m || typeof m !== "object") {
        return NextResponse.json({ error: "Invalid monthData payload." }, { status: 400 });
      }

      let monthStart = typeof m.month_start === "string" ? m.month_start.trim() : "";
      
      // Auto-normalize YYYY-MM to YYYY-MM-01
      if (/^\d{4}-\d{2}$/.test(monthStart)) {
        monthStart = `${monthStart}-01`;
      } 
      // Auto-normalize any day in month YYYY-MM-DD to YYYY-MM-01
      else if (/^\d{4}-\d{2}-\d{2}$/.test(monthStart)) {
        const [y, mm] = monthStart.split("-");
        monthStart = `${y}-${mm}-01`;
      }

      if (!monthStart || !/^\d{4}-\d{2}-01$/.test(monthStart)) {
        return NextResponse.json(
          { error: "Invalid month_start format. Expected YYYY-MM-01 (e.g. 2026-10-01)." },
          { status: 400 }
        );
      }

      const actualAmount = Number(m.actual_amount);
      if (isNaN(actualAmount) || actualAmount < 0) {
        return NextResponse.json(
          { error: "Actual revenue cannot be negative. Credit notes must be entered as documented adjustments." },
          { status: 400 }
        );
      }

      const targetAmount = Number(m.target_amount ?? 0);
      if (isNaN(targetAmount) || targetAmount < 0) {
        return NextResponse.json({ error: "Target revenue cannot be negative." }, { status: 400 });
      }

      const record = await dbRepository.saveRevenueMonth(
        {
          month_start: monthStart,
          actual_amount: actualAmount,
          target_amount: targetAmount,
          note: m.note,
        },
        actorId
      );
      return NextResponse.json(record);
    }

    if (body.type === "milestone") {
      const m = body.milestone;
      if (!m || typeof m !== "object") {
        return NextResponse.json({ error: "Invalid milestone payload." }, { status: 400 });
      }

      if (!m.title || !m.title.trim()) {
        return NextResponse.json({ error: "Milestone title is required." }, { status: 400 });
      }

      const saved = await dbRepository.saveMilestone(
        {
          id: m.id,
          title: m.title.trim(),
          description: m.description?.trim() || "",
          milestone_date: m.milestone_date || new Date().toISOString().split("T")[0],
          visibility: m.visibility !== undefined ? Boolean(m.visibility) : true,
          sort_order: Number(m.sort_order) || 1,
        },
        actorId
      );
      return NextResponse.json(saved);
    }

    if (body.type === "delete_milestone") {
      const milestoneId = body.id;
      if (!milestoneId) {
        return NextResponse.json({ error: "Milestone ID is required." }, { status: 400 });
      }

      await dbRepository.deleteMilestone(milestoneId, actorId);
      return NextResponse.json({ success: true, id: milestoneId });
    }

    if (body.type === "delete_month") {
      const monthId = body.id;
      if (!monthId) {
        return NextResponse.json({ error: "Month ID is required." }, { status: 400 });
      }

      await dbRepository.deleteRevenueMonth(monthId, actorId);
      return NextResponse.json({ success: true, id: monthId });
    }

    if (body.type === "clear_months") {
      await dbRepository.clearAllRevenueMonths(actorId);
      return NextResponse.json({ success: true, message: "All revenue months cleared." });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
