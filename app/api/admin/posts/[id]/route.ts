import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPostBySlug, savePost, deletePost } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: slug } = await params;

  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Keep existing slug if updating
    const post = await savePost({
      ...body,
      slug,
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: slug } = await params;
  const deleted = await deletePost(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
