import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

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
    const body = await req.json();
    const actorId = body.actorId || "admin-1";

    if (body.type === "settings") {
      const updated = await dbRepository.updateRevenueSettings(body.settings, actorId);
      return NextResponse.json(updated);
    }

    if (body.type === "month") {
      const record = await dbRepository.saveRevenueMonth(body.monthData, actorId);
      return NextResponse.json(record);
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
