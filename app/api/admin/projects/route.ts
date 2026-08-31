import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProjects, saveProject } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await getProjects(false);
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const saved = await saveProject(data);
    return NextResponse.json({ success: true, project: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save project", details: String(error) },
      { status: 500 }
    );
  }
}
