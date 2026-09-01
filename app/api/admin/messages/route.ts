import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getMessages, getUnreadMessagesCount } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [messages, unreadCount] = await Promise.all([
      getMessages(),
      getUnreadMessagesCount(),
    ]);

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages", details: String(error) },
      { status: 500 }
    );
  }
}
