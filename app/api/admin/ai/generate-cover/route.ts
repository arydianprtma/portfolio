import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  return key;
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, summary, tags = [] } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required to generate a cover image" },
        { status: 400 }
      );
    }

    // 1. Generate an optimized visual prompt using Gemini
    let visualPrompt = `futuristic dark tech illustration for ${title}, modern developer workspace, code, cyber neon red accents, 8k wallpaper`;

    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const promptText = `You are an art director creating a high-end, futuristic tech cover image banner for a developer blog article.
Article Title: "${title}"
Summary: "${summary || ""}"
Tags: ${tags.join(", ")}

Write a concise, descriptive English image prompt (1-2 sentences) for an AI image generator. Focus on:
- Conceptual 3D tech illustration, digital geometry, code abstractions, or modern software development aesthetic.
- Color palette: Dark mode background, sleek carbon grey, subtle neon red (#E31B23) and cyan accents.
- Style: Minimalist, cinematic lighting, 4K rendering, no distorted text or messy watermarks.

Return ONLY the raw prompt text, nothing else.`;

      const result = await model.generateContent(promptText);
      const text = result.response.text().trim();
      if (text) {
        visualPrompt = text;
      }
    } catch (aiErr) {
      console.warn("Gemini prompt enhancement skipped, using fallback prompt:", aiErr);
    }

    // 2. Fetch the generated image from Pollinations AI
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      visualPrompt
    )}?width=1200&height=630&nologo=true&seed=${seed}&model=flux`;

    const imgRes = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!imgRes.ok) {
      throw new Error(`AI Image provider returned status ${imgRes.status}`);
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Save buffer to /public/uploads/
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .slice(0, 30);
    const filename = `${Date.now()}-ai-cover-${safeSlug || "article"}.png`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      prompt: visualPrompt,
    });
  } catch (error: any) {
    console.error("AI Cover Image Generation Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate AI cover image",
      },
      { status: 500 }
    );
  }
}
