import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.isAuthenticated || (!auth.isAdmin && !auth.isEditor)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator or Editor privileges required." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds 8MB limit." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine extension
    let ext = "jpg";
    if (file.type.includes("png")) ext = "png";
    else if (file.type.includes("webp")) ext = "webp";
    else if (file.type.includes("gif")) ext = "gif";

    const fileName = `founder-portrait-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "images");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (err: any) {
    console.error("Founder photo upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload founder photo." },
      { status: 500 }
    );
  }
}
