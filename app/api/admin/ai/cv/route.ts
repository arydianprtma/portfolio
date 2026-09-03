import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { enhanceCvSectionWithAi, translateFullCvWithAi } from "@/lib/gemini";
import { CvData } from "@/types";

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.action === "translate_full") {
      const { cv, targetLang } = body as { cv: CvData; targetLang: "en" | "id" };
      if (!cv) {
        return NextResponse.json({ error: "CV data is required" }, { status: 400 });
      }
      const translated = await translateFullCvWithAi(cv, targetLang || "id");
      return NextResponse.json({ success: true, translated });
    }

    const { type, currentText, roleContext, technologiesContext, language } = body as {
      type: "summary" | "experience_highlight" | "project_highlight" | "project_description";
      currentText: string;
      roleContext?: string;
      technologiesContext?: string[];
      language: "en" | "id";
    };

    if (!currentText || !currentText.trim()) {
      return NextResponse.json({ error: "Text content is required" }, { status: 400 });
    }

    const enhanced = await enhanceCvSectionWithAi({
      type: type || "summary",
      currentText: currentText.trim(),
      roleContext: roleContext || "Full Stack Developer",
      technologiesContext,
      language: language || "en",
    });

    return NextResponse.json({ success: true, enhanced });
  } catch (error: any) {
    console.error("AI CV Polish Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI CV request" },
      { status: 500 }
    );
  }
}
