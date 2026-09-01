import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getExperiments, saveExperiment } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const experiments = await getExperiments();
  return NextResponse.json({ experiments });
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const saved = await saveExperiment(data);
    return NextResponse.json({ success: true, experiment: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save experiment", details: String(error) },
      { status: 500 }
    );
  }
}
