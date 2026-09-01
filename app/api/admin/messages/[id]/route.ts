import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getMessageById, markMessageAsRead, deleteMessage } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const message = await getMessageById(id);

  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ message });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { read } = body;

  const success = await markMessageAsRead(id, read ?? true);

  if (!success) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteMessage(id);

  if (!success) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
