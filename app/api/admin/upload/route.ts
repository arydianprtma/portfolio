import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "application/pdf",
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, SVG, GIF, and PDF files are allowed." },
        { status: 400 }
      );
    }

    // Max 1MB for images, 5MB for PDF documents
    const maxLimit = file.type === "application/pdf" ? 5 * 1024 * 1024 : 1 * 1024 * 1024;
    const limitLabel = file.type === "application/pdf" ? "5MB" : "1MB";

    if (file.size > maxLimit) {
      return NextResponse.json(
        { error: `File size exceeds ${limitLabel} limit.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique safe filename
    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file", details: String(error) },
      { status: 500 }
    );
  }
}
