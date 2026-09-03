import { NextResponse } from "next/server";
import { incrementPageView, incrementCvDownload, getAnalytics } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { event, path } = body;

    // Reject tracking on admin, invoice, cv, and api paths
    if (
      path &&
      (path.startsWith("/admin") ||
        path.startsWith("/invoice") ||
        path.startsWith("/cv") ||
        path.startsWith("/api"))
    ) {
      return NextResponse.json({
        success: true,
        ignored: true,
        reason: "Internal / Private / Excluded route",
      });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || undefined;

    let count = 0;
    if (event === "cv_download") {
      count = await incrementCvDownload({ ip, userAgent });
    } else {
      // Default to pageview
      count = await incrementPageView({ path: path || "/", ip, userAgent });
    }

    return NextResponse.json({
      success: true,
      event,
      count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track analytics event", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  const analytics = await getAnalytics();
  return NextResponse.json(analytics);
}
