import { NextRequest, NextResponse } from "next/server";
import { dbRepository } from "@/lib/db/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, moderatorId } = body;

    if (!["approved", "rejected", "spam", "removed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await dbRepository.moderateComment(
      params.id,
      status,
      moderatorId || "admin-1"
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
