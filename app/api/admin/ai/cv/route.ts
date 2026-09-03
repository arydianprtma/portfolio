import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { enhanceCvSectionWithAi } from "@/lib/gemini";

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, currentText, roleContext, language } = body as {
      type: "summary" | "experience_highlight" | "project_highlight";
      currentText: string;
      roleContext?: string;
      language: "en" | "id";
    };

    if (!currentText || !currentText.trim()) {
      return NextResponse.json({ error: "Text content is required" }, { status: 400 });
    }

    const enhanced = await enhanceCvSectionWithAi({
      type: type || "summary",
      currentText: currentText.trim(),
      roleContext: roleContext || "Full Stack Developer",
      language: language || "en",
    });

    return NextResponse.json({ success: true, enhanced });
  } catch (error: any) {
    console.error("AI CV Polish Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance CV with AI" },
      { status: 500 }
    );
  }
}
