import { NextResponse } from "next/server";
import { chatWithGemini, ChatMessage } from "@/lib/gemini";
import {
  getProfile,
  getSkills,
  getProjects,
  getPosts,
  getCvData,
  getProposalById,
} from "@/lib/storage";
import { Proposal } from "@/types";

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
    const [profile, skills, projects, posts, cvData] = await Promise.all([
      getProfile(),
      getSkills(),
      getProjects(),
      getPosts(),
      getCvData(),
    ]);

    // Check if the user mentioned or referenced a specific Proposal (via CUID, proposal number, or URL)
    let proposalContext = "";
    let matchedProposal: Proposal | null = null;
    const allUserText = messages.map((m) => m.content).join(" ");
    const proposalUrlMatch = allUserText.match(/\/proposal\/([a-zA-Z0-9_-]+)/i);
    const propNumberMatch = allUserText.match(/\b(PROP-\d{4}-\d+)\b/i);
    const cuidMatch = allUserText.match(/\b(c[a-z0-9]{20,32})\b/i);

    const targetProposalQuery =
      proposalUrlMatch?.[1] || propNumberMatch?.[1] || cuidMatch?.[1] || null;

    if (targetProposalQuery) {
      matchedProposal = await getProposalById(targetProposalQuery);
      if (matchedProposal) {
        const prop = matchedProposal;
        proposalContext = `
SPECIFIC PROPOSAL REFERENCED BY CLIENT:
- Proposal ID / Code Hash: ${prop.id}
- Proposal Number: ${prop.proposalNumber}
- Project Title: ${prop.title}
- Client Name: ${prop.clientName} (${prop.clientCompany || "Individu / Perusahaan"})
- Status: ${prop.status}
- Date: ${new Date(prop.issueDate).toLocaleDateString("id-ID")} (Valid until: ${new Date(prop.validUntil).toLocaleDateString("id-ID")})
- Direct Public Link: https://portfolio.ardp.my.id/proposal/${prop.id}
- Executive Summary: ${prop.summary || "-"}
- Scope of Work & Deliverable Modules:
${(prop.deliverables || [])
  .map(
    (d, i) =>
      `  * Modul ${i + 1} (${d.title}): ${d.description || ""} - Features: ${(d.features || []).join(", ")}`
  )
  .join("\n")}
- Project Timeline / Milestones:
${(prop.timeline || [])
  .map((t) => `  * ${t.phase} (${t.duration}): ${t.activities}`)
  .join("\n")}
- Investment & Pricing:
${(prop.items || [])
  .map(
    (it) =>
      `  * ${it.description} (${it.quantity}x @ ${prop.currency} ${it.rate.toLocaleString()} = ${prop.currency} ${it.amount.toLocaleString()})`
  )
  .join("\n")}
  * Subtotal: ${prop.currency} ${prop.subtotal.toLocaleString()}
  * Total Investment: ${prop.currency} ${prop.total.toLocaleString()}
- Payment Terms: ${prop.paymentTerms || "-"}
- Guarantee & Terms: ${prop.terms || "-"}
- INSTRUCTIONS: The user has provided or referenced the proposal code "${targetProposalQuery}". Greet the client politely, confirm that you have retrieved the official proposal for "${prop.title}" (${prop.proposalNumber}), and answer any questions about the scope, modules, timeline, investment cost, payment terms, or how to proceed!
`;
      }
    }

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

    const cvExperiencesSummary = (cvData.experiences || [])
      .filter((e) => e.enabled !== false)
      .map((e) => `- ${e.role} @ ${e.company} (${e.startDate} - ${e.endDate || "Present"})`)
      .join("\n");

    const cvEducationSummary = (cvData.education || [])
      .filter((e) => e.enabled !== false)
      .map((e) => `- ${e.degree} at ${e.institution} (${e.year})`)
      .join("\n");

    const cvCertsSummary = (cvData.certifications || []).join("; ");

    // Compute direct PDF CV link (from profile.resumeUrl or standard resume link)
    const resumePdfUrl = profile.resumeUrl
      ? profile.resumeUrl.startsWith("http")
        ? profile.resumeUrl
        : `https://portfolio.ardp.my.id${profile.resumeUrl}`
      : "https://portfolio.ardp.my.id/cv";

    const systemInstruction = `You are the official AI Assistant and interactive digital twin for Ary Dian Pratama (often called "Ary" or "ARDP").
You are embedded directly inside his personal developer portfolio website (portfolio.ardp.my.id).

YOUR MISSION:
Help visitors, recruiters, and prospective clients learn about Ary's background, engineering philosophy, tech stack, featured projects, services, provide his CV / Resume, explain project proposals, and how to hire/contact him.

ABOUT ARY DIAN PRATAMA:
- Name: ${profile.name || "Ary Dian Pratama"}
- Primary Role: ${profile.role || "Website Developer & Full-Stack Engineer"}
- Location: ${profile.location || "Indonesia"}
- Email: ${profile.email || "arydianprtma@gmail.com"}
- Availability: ${profile.status || "Available for select opportunities & contract work"}
- Bio: ${(profile.bio || []).join(" ")}
- Socials: GitHub (${profile.socials?.github || ""}), LinkedIn (${profile.socials?.linkedin || ""}), Instagram (${profile.socials?.instagram || ""})

${proposalContext}

CURRICULUM VITAE (CV / RESUME) ACCESS & DETAILS (CRITICAL):
- Direct Official CV (PDF) Download Link: [Download Curriculum Vitae (PDF)](${resumePdfUrl})
- Interactive Live CV Web Page: [Buka Halaman CV Interaktif](https://portfolio.ardp.my.id/cv)
- When a user or recruiter asks for Ary's CV, Resume, curriculum vitae, riwayat hidup, or asks how to download/see his CV:
  1. Immediately provide the direct links warmly! Example: "Tentu! Anda dapat mengunduh file PDF resmi Ary di sini: [Download Curriculum Vitae (PDF)](${resumePdfUrl}) atau melihat versi interaktifnya di [Halaman CV Interaktif](https://portfolio.ardp.my.id/cv)."
  2. Briefly summarize his highlights if helpful:
     * Experience: ${cvExperiencesSummary || "Lead Developer & Software Engineering Projects"}
     * Education: ${cvEducationSummary || "Bachelor of Computer Science (Informatics)"}
     * Certifications: ${cvCertsSummary || "Red Hat System Administration, Applied Microsoft Office"}

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

    // 4. Call Gemini AI with graceful fallback handling
    let reply: string;
    try {
      reply = await chatWithGemini({
        messages,
        systemInstruction,
      });
    } catch (aiErr) {
      console.warn("Gemini AI API temporarily unavailable, using smart fallback reply:", aiErr);
      const lastUserMsg = (messages[messages.length - 1]?.content || "").toLowerCase();

      if (matchedProposal) {
        reply = `Halo! Saya menemukan dokumen proposal resmi untuk proyek **"${matchedProposal.title}"** (${matchedProposal.proposalNumber}) yang ditujukan kepada **${matchedProposal.clientName}**.\n\n- **Total Investasi**: ${matchedProposal.currency} ${matchedProposal.total.toLocaleString()}\n- **Status**: ${matchedProposal.status}\n- **Tautan Proposal Resmi**: [Buka Dokumen Proposal](https://portfolio.ardp.my.id/proposal/${matchedProposal.id})\n\nAda bagian modul, jadwal pengerjaan, atau skema pembayaran yang ingin Anda diskusikan lebih lanjut?`;
      } else if (
        lastUserMsg.includes("cv") ||
        lastUserMsg.includes("resume") ||
        lastUserMsg.includes("riwayat") ||
        lastUserMsg.includes("download") ||
        lastUserMsg.includes("liat") ||
        lastUserMsg.includes("lihat")
      ) {
        reply = `Tentu! Anda dapat melihat dan mengunduh berkas resmi **Curriculum Vitae (PDF)** Ary Dian Pratama di sini:\n\n[Download Curriculum Vitae (PDF)](${resumePdfUrl})\n[Buka Halaman CV Interaktif](https://portfolio.ardp.my.id/cv)\n\nSilakan beri tahu saya jika ada rincian pengalaman atau proyek Ary yang ingin Anda ketahui lebih lanjut!`;
      } else if (
        lastUserMsg.includes("kontak") ||
        lastUserMsg.includes("contact") ||
        lastUserMsg.includes("email") ||
        lastUserMsg.includes("hire") ||
        lastUserMsg.includes("hubungi") ||
        lastUserMsg.includes("kerja")
      ) {
        reply = `Anda dapat menghubungi Ary Dian Pratama langsung melalui:\n- Email: [${profile.email || "arydianprtma@gmail.com"}](mailto:${profile.email || "arydianprtma@gmail.com"})\n- LinkedIn: [Ary Dian Pratama](${profile.socials?.linkedin || "https://linkedin.com"})\n- Atau melalui formulir Kontak di bagian bawah halaman website ini.`;
      } else if (
        lastUserMsg.includes("proyek") ||
        lastUserMsg.includes("project") ||
        lastUserMsg.includes("karya") ||
        lastUserMsg.includes("portfolio")
      ) {
        reply = `Ary Dian Pratama telah merancang dan membangun berbagai aplikasi web berkinerja tinggi serta sistem full-stack. Anda dapat melihat detail case study di bagian **Featured Works** pada portofolio ini.`;
      } else {
        reply = `Halo! Saya adalah ARDP AI Assistant. Saya siap membantu Anda mengetahui lebih lanjut seputar keahlian teknis (Next.js, TypeScript, PostgreSQL), portofolio proyek, serta layanan pengembangan software **Ary Dian Pratama**. Ada yang ingin Anda tanyakan seputar karya Ary?`;
      }
    }

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
