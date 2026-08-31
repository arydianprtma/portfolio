import { NextResponse } from "next/server";
import { incrementPageView, incrementCvDownload, getAnalytics } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { event } = body;

    let count = 0;
    if (event === "cv_download") {
      count = await incrementCvDownload();
    } else {
      // Default to pageview
      count = await incrementPageView();
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
