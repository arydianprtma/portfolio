import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPosts, savePost } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getPosts(false); // get all posts (including drafts)
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await savePost(body);
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save post", details: String(error) },
      { status: 500 }
    );
  }
}
