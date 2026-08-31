import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProjectBySlug, saveProject, deleteProject } from "@/lib/storage";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: RouteProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: slug } = await params;
    const data = await request.json();
    const updated = await saveProject({ ...data, slug });
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: slug } = await params;
    const success = await deleteProject(slug);
    if (!success) {
      return NextResponse.json({ error: "Project not found or could not be deleted" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project", details: String(error) },
      { status: 500 }
    );
  }
}
