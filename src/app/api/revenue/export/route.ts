import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  try {
    // Enforce server-side administrator authorization (AC-15, AC-25)
    const auth = await verifyAdminAuth();

    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json(
        { error: "Authentication required to export financial ledger." },
        { status: 401 }
      );
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden. Administrator privileges required to export financial ledger." },
        { status: 403 }
      );
    }

    const months = await dbRepository.getRevenueMonths(true);

    const headers = ["Month Start", "Target Amount (INR)", "Actual Amount (INR)", "Variance (INR)", "Note", "Updated At"];
    const rows = months.map((m) => {
      const actual = Number(m.actual_amount) || 0;
      const target = Number(m.target_amount) || 0;
      const variance = actual - target;
      const cleanNote = (m.note || "").replace(/"/g, '""');
      return [
        m.month_start,
        target.toFixed(2),
        actual.toFixed(2),
        variance.toFixed(2),
        `"${cleanNote}"`,
        m.updated_at,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="project-dhurandhar-revenue-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
