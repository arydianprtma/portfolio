import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params;
    const filePathSegment = Array.isArray(filename) ? filename.join("/") : filename;

    // Prevent directory traversal
    const safePath = path.normalize(filePathSegment).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(process.cwd(), "public", "uploads", safePath);

    if (!fs.existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileBuffer = fs.readFileSync(fullPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving upload file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
