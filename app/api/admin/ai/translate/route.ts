import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { translateContent } from "@/lib/gemini";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fields, sourceLang, targetLang, context } = await request.json();

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
