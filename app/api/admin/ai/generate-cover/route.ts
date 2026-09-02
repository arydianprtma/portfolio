import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const ACTIVE_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash",
];

function getApiKey(): string {
  const key = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "")
    .replace(/^["']|["']$/g, "")
    .trim();
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
    let visualPrompt = `high-end minimalist 3D render tech banner for ${title}, sleek modern developer workspace, glowing glass icon, dark obsidian background, soft studio lighting, octane render, ultra clean, 8k, no people, no faces, no masks`;

    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenerativeAI(apiKey);

      const promptText = `You are a world-class art director at Stripe or Vercel creating a clean, professional, high-end article cover banner.
Article Title: "${title}"
Summary: "${summary || ""}"
Tags: ${tags.join(", ")}
Requested Style: "${body.style || "minimal_3d"}"

Rules for the image prompt:
- FOCUS: Beautiful modern software engineering visuals, minimalist 3D glass geometry, clean code on a borderless modern display, sleek dark studio aesthetic, or iconic tech symbols (e.g. glowing cube for Laravel/frameworks, data nodes for databases, clean terminal for CLI).
- PALETTE: Elegant dark matte theme (charcoal/obsidian #111111) with tasteful neon red (#E31B23) or cyan/purple subtle glowing highlights.
- STRICTLY FORBIDDEN: NO humans, NO faces, NO creepy hooded hackers, NO masks, NO anime characters, NO messy watermarks, NO blurry text.
- STYLE: Minimalist 3D Octane render, raytracing, soft studio depth of field, Apple/Stripe keynote aesthetic, ultra-clean 4K wallpaper.

Write a single concise English image prompt (under 35 words).
Return ONLY the raw prompt text, nothing else.`;

      for (const modelName of ACTIVE_MODELS) {
        try {
          const model = ai.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(promptText);
          const text = result.response.text().trim();
          if (text) {
            visualPrompt = `${text}, clean aesthetic, soft studio lighting, 8k resolution, no humans, no masks, no faces`;
            break;
          }
        } catch {
          // try next model
        }
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
