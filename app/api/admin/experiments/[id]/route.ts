import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteExperiment, saveExperiment } from "@/lib/storage";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const ok = await deleteExperiment(id);
    if (!ok) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete experiment", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const saved = await saveExperiment({ ...body, id });
    return NextResponse.json({ success: true, experiment: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update experiment", details: String(error) },
      { status: 500 }
    );
  }
}
