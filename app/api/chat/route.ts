import { NextResponse } from "next/server";
import { chatWithGemini, ChatMessage } from "@/lib/gemini";
import { getProfile, getSkills, getProjects, getPosts } from "@/lib/storage";

// In-memory sliding-window rate limiter (Max 15 queries per 10 minutes per IP)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };

  // Clean timestamps older than window
  record.timestamps = record.timestamps.filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  );

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  record.timestamps.push(now);
  rateLimitMap.set(ip, record);
  return true;
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous-client";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Terlalu banyak pesan dalam waktu singkat. Harap tunggu beberapa menit sebelum mencoba lagi. (Rate limit: 15 pesan / 10 menit)",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json();
    const rawMessages = body.messages as ChatMessage[];

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Sanitize & limit message history (last 10 messages max)
    const messages: ChatMessage[] = rawMessages
      .slice(-10)
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: String(m.content || "").slice(0, 2000).trim(),
      }))
      .filter((m) => m.content.length > 0);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Pesan tidak valid." },
        { status: 400 }
      );
    }

    // 3. Dynamically Fetch Knowledge Context from Database / Storage
    const [profile, skills, projects, posts] = await Promise.all([
      getProfile(),
      getSkills(),
      getProjects(),
      getPosts(),
    ]);

    const projectsSummary = projects
      .slice(0, 8)
      .map(
        (p) =>
          `- ${p.title} (${p.category}, ${p.year}): ${p.subtitle || p.description}. Tech: ${(p.technologies || []).join(", ")}. Demo: ${p.demo || "N/A"}, GitHub: ${p.github || "N/A"}`
      )
      .join("\n");

    const skillsSummary = skills
      .map((s) => `${s.title}: ${(s.skills || []).join(", ")}`)
      .join("\n");

    const postsSummary = posts
      .slice(0, 5)
      .map((p) => `- ${p.title} (Tags: ${(p.tags || []).join(", ")}): ${p.summary}`)
      .join("\n");

    const systemInstruction = `You are the official AI Assistant and interactive digital twin for Ary Dian Pratama (often called "Ary" or "ARDP").
You are embedded directly inside his personal developer portfolio website (portfolio.ardp.my.id).

YOUR MISSION:
Help visitors, recruiters, and prospective clients learn about Ary's background, engineering philosophy, tech stack, featured projects, services, and how to hire/contact him.

ABOUT ARY DIAN PRATAMA:
- Name: ${profile.name || "Ary Dian Pratama"}
- Primary Role: ${profile.role || "Website Developer & Full-Stack Engineer"}
- Location: ${profile.location || "Indonesia"}
- Email: ${profile.email || "arydianprtma@gmail.com"}
- Availability: ${profile.status || "Available for select opportunities & contract work"}
- Bio: ${(profile.bio || []).join(" ")}
- Socials: GitHub (${profile.socials?.github || ""}), LinkedIn (${profile.socials?.linkedin || ""}), Instagram (${profile.socials?.instagram || ""})

CORE SKILLS & TECH STACK:
${skillsSummary || "Next.js, React, TypeScript, Tailwind CSS, GSAP, PostgreSQL, Prisma, Supabase, Node.js, REST APIs, Git"}

FEATURED PROJECTS & CASE STUDIES:
${projectsSummary || "Various high-performance web applications and systems"}

RECENT ARTICLES / BLOG:
${postsSummary || "Technical guides on web development and architecture"}

SERVICES & FREELANCE / CONTRACT CAPABILITIES:
- Full-Stack Web Application Development (Next.js, React, Node.js, PostgreSQL)
- High-Performance UI/UX & Interactive Frontends (Tailwind CSS, GSAP, animations)
- System Architecture, API Design, & Database Engineering
- Client Invoicing & Consulting

STRICT SCOPE & GUARDRAIL RULES (MANDATORY):
1. **STRICTLY REFUSE OFF-TOPIC / GENERAL AI REQUESTS**: You are exclusively the portfolio assistant for Ary Dian Pratama. You are NOT a general-purpose AI, homework solver, or free code generator.
2. If the user asks for random code generation (e.g., "buatkan kode python game ular", "write a python script", "create an app for me from scratch"), general knowledge, homework, recipes, or anything unrelated to Ary Dian Pratama and his portfolio/services:
   - **YOU MUST POLITELY DECLINE AND REFUSE TO PERFORM THE TASK.**
   - In Indonesian reply: "Maaf, sebagai ARDP AI Assistant, saya hanya dapat menjawab pertanyaan seputar **Ary Dian Pratama**, portofolio proyek, keahlian teknis, dan layanan pengembangan software Ary. Ada yang ingin Anda ketahui seputar karya atau kerja sama bersama Ary?"
   - In English reply: "I am specifically dedicated to answering questions about **Ary Dian Pratama**, his portfolio projects, technical skills, and software engineering services. Please let me know if you'd like to explore Ary's work or discuss a project collaboration!"
3. **CONCISE & FAST ANSWERS**: Keep responses short, direct, and under 3-4 sentences whenever possible. Never output long essays.
4. If asked about pricing, hiring, or consulting, invite them to submit an inquiry through the Contact section or email ${profile.email}.`;

    // 4. Call Gemini AI
    const reply = await chatWithGemini({
      messages,
      systemInstruction,
    });

    return NextResponse.json({
      success: true,
      message: reply,
    });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Maaf, asisten AI sedang mengalami kendala teknis. Silakan coba lagi nanti.",
      },
      { status: 500 }
    );
  }
}
