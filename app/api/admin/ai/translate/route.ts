import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  translateContent,
  completeAndTranslatePost,
  completeAndTranslateProject,
} from "@/lib/gemini";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type = "general", data, fields, sourceLang, targetLang, context } = body;

    // 1. Post/Article Mode: Auto-drafts & translates all fields (Title, Summary, Content Markdown, Tags, ReadingTime)
    if (type === "post") {
      const generated = await completeAndTranslatePost(data || {});
      return NextResponse.json({ success: true, result: generated });
    }

    // 2. Project Mode: Auto-drafts & translates all fields (Subtitle, Description, Overview, Techs)
    if (type === "project") {
      const generated = await completeAndTranslateProject(data || {});
      return NextResponse.json({ success: true, result: generated });
    }

    // 3. General Key-Value Translation Mode
    if (!fields || typeof fields !== "object" || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for translation" },
        { status: 400 }
      );
    }

    const translatedFields = await translateContent({
      fields,
      sourceLang: sourceLang || "en",
      targetLang: targetLang || "id",
      context,
    });

    return NextResponse.json({ success: true, translated: translatedFields });
  } catch (error: any) {
    console.error("AI Translation Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate AI translation",
      },
      { status: 500 }
    );
  }
}
