import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { resetAnalytics } from "@/lib/storage";

export async function POST() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await resetAnalytics();
    if (!success) {
      throw new Error("Failed to reset analytics");
    }
    return NextResponse.json({
      success: true,
      message: "Web visits and analytics counter have been reset to 0.",
    });
  } catch (error: any) {
    console.error("Reset Analytics Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset analytics" },
      { status: 500 }
    );
  }
}
