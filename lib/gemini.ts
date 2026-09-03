import { CvData, CvExperience, CvEducation, CvProjectItem } from "@/types";

// Verified active Google Gemini models ordered by speed and capability (< 850ms latency)
const ACTIVE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-flash-lite-latest",
];

function getApiKey(): string {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY belum diisi di file .env. Dapatkan API key gratis di https://aistudio.google.com/apikey"
    );
  }

  return apiKey;
}

async function callGemini(prompt: string): Promise<any> {
  const apiKey = getApiKey();
  let lastError: any = null;

  for (const modelName of ACTIVE_MODELS) {
    try {
      const restRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const restData = await restRes.json();
      if (restData.error) {
        throw new Error(restData.error.message);
      }

      const rawText = restData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let cleaned = rawText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      return JSON.parse(cleaned);
    } catch (err: any) {
      console.warn(`Model ${modelName} failed, trying next:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message ||
      "Gagal menghubungi Gemini AI. Pastikan API key Google AI Studio Anda aktif."
  );
}

// 1. General Key-Value Translation
export async function translateContent({
  fields,
  sourceLang = "en",
  targetLang = "id",
  context = "software engineering developer portfolio",
}: {
  fields: Record<string, any>;
  sourceLang: "en" | "id";
  targetLang: "en" | "id";
  context?: string;
}): Promise<Record<string, any>> {
  const fromLanguageName = sourceLang === "en" ? "English" : "Indonesian (Bahasa Indonesia)";
  const toLanguageName = targetLang === "en" ? "English" : "Indonesian (Bahasa Indonesia)";

  const prompt = `You are an expert technical translator and developer portfolio editor.
Translate the following JSON fields from ${fromLanguageName} to ${toLanguageName}.

Context: ${context}.
Target audience: High-end technology recruiters, enterprise software clients, and design agencies.
Requirements:
1. Maintain high technical precision, professional tone, and natural phrasing.
2. Keep technical terms, acronyms, framework names (e.g. Next.js, TypeScript, PostgreSQL, GSAP, Docker, GraphQL, API, Calculator) intact unless a natural Indonesian equivalent is standard.
3. Preserve all Markdown formatting, code snippets, lists, and line breaks exactly.
4. Output MUST be valid JSON matching the exact keys provided in the input, with translated string or string array values.
5. Return ONLY the raw JSON object, without any surrounding markdown code fences (\`\`\`json).

Input fields to translate:
${JSON.stringify(fields, null, 2)}`;

  return await callGemini(prompt);
}

// 2. Full Article Auto-Completer & Dual-Language Syncer
export async function completeAndTranslatePost(input: {
  title?: string;
  titleId?: string;
  summary?: string;
  summaryId?: string;
  content?: string;
  contentId?: string;
  tags?: string[];
  activeLanguage?: "en" | "id";
}) {
  const prompt = `You are a principal software engineer and technical author creating a comprehensive, high-quality developer blog article.
You are given article information in either English or Indonesian.
Your task is to produce BOTH complete, in-depth English and Indonesian versions for all fields (Title, Summary, and full Markdown Article Content).

Input provided:
- Title (EN): "${input.title || ""}"
- Title (ID): "${input.titleId || ""}"
- Summary (EN): "${input.summary || ""}"
- Summary (ID): "${input.summaryId || ""}"
- Content (EN Markdown): ${JSON.stringify(input.content || "")}
- Content (ID Markdown): ${JSON.stringify(input.contentId || "")}
- Current Tags: ${JSON.stringify(input.tags || [])}
- Active Tab: "${input.activeLanguage || "en"}"

Requirements:
1. **title** (English) & **titleId** (Indonesian): Catchy, professional technical titles (e.g. "How to Install Laravel 11 on Windows and Linux" / "Panduan Lengkap Cara Instal Laravel 11 di Windows dan Linux").
2. **summary** (English) & **summaryId** (Indonesian): Crisp, engaging 2-3 sentence overview explaining prerequisites and what the reader will achieve.
3. **content** (English Markdown) & **contentId** (Indonesian Markdown):
   - ALWAYS generate a rich, full-length, step-by-step technical guide (with 4-6 detailed sections).
   - Structure with clean Markdown headings:
     ## 01. Persyaratan Sistem / Prerequisites & System Requirements
     ## 02. Instalasi & Konfigurasi / Step-by-Step Installation
     ## 03. Menjalankan Proyek / Serving the Application
     ## 04. Struktur Direktori & Konfigurasi / Directory Structure & Configuration
     ## 05. Kesimpulan & Langkah Selanjutnya / Summary & Next Steps
   - Include clear, realistic shell/code blocks (e.g. \`\`\`bash\\ncomposer create-project laravel/laravel my-project\\ncd my-project\\nphp artisan serve\\n\`\`\`).
   - If content was already provided by the user, expand and accurately translate it to the other language while keeping all code snippets aligned.
4. **tags**: 3-5 modern developer tags matching the framework/topic (e.g. ["Laravel 11", "PHP", "Web Development", "Backend"]).
5. **readingTime**: Estimated reading time (e.g. "5 min read").

Return ONLY valid JSON matching this exact structure:
{
  "title": "string (English)",
  "titleId": "string (Indonesian)",
  "summary": "string (English)",
  "summaryId": "string (Indonesian)",
  "content": "string (English Markdown)",
  "contentId": "string (Indonesian Markdown)",
  "tags": ["string"],
  "readingTime": "string"
}`;

  return await callGemini(prompt);
}

// 3. Full Project Auto-Completer & Dual-Language Syncer
export async function completeAndTranslateProject(input: {
  title?: string;
  subtitle?: string;
  subtitleId?: string;
  role?: string;
  roleId?: string;
  deliveryStatus?: string;
  deliveryStatusId?: string;
  description?: string;
  descriptionId?: string;
  overview?: string;
  overviewId?: string;
  features?: string[];
  featuresId?: string[];
  challenges?: string[];
  challengesId?: string[];
  category?: string;
  technologies?: string[];
  activeLanguage?: "en" | "id";
}) {
  const prompt = `You are an expert full-stack developer portfolio editor.
You are given project showcase information in either English or Indonesian.
Your task is to accurately generate, translate, and populate BOTH English and Indonesian versions of ALL fields including features and technical challenges.

Input provided:
- Project Title: "${input.title || ""}"
- Subtitle (EN): "${input.subtitle || ""}"
- Subtitle (ID): "${input.subtitleId || ""}"
- Role (EN): "${input.role || ""}"
- Role (ID): "${input.roleId || ""}"
- Delivery Status (EN): "${input.deliveryStatus || ""}"
- Delivery Status (ID): "${input.deliveryStatusId || ""}"
- Short Description (EN): "${input.description || ""}"
- Short Description (ID): "${input.descriptionId || ""}"
- Overview (EN Case Study): ${JSON.stringify(input.overview || "")}
- Overview (ID Case Study): ${JSON.stringify(input.overviewId || "")}
- Key Features (EN): ${JSON.stringify(input.features || [])}
- Key Features (ID): ${JSON.stringify(input.featuresId || [])}
- Technical Challenges & Solutions (EN): ${JSON.stringify(input.challenges || [])}
- Technical Challenges & Solutions (ID): ${JSON.stringify(input.challengesId || [])}
- Category: "${input.category || ""}"
- Technologies: ${JSON.stringify(input.technologies || [])}
- Active Tab: "${input.activeLanguage || "en"}"

Requirements:
1. **subtitle** (English) & **subtitleId** (Indonesian): Catchy uppercase tagline (e.g. "HIGH-PERFORMANCE WEB APPLICATION" / "APLIKASI WEB BERKINERJA TINGGI").
2. **role** (English) & **roleId** (Indonesian): Developer role translation (e.g. "Lead Developer & Full-Stack Architect" ➔ "Pengembang Utama & Arsitek Full-Stack").
3. **deliveryStatus** (English) & **deliveryStatusId** (Indonesian): Status rilis translation (e.g. "Production Ready" ➔ "Siap Produksi", "Active Development" ➔ "Dalam Pengembangan").
4. **description** (English) & **descriptionId** (Indonesian): Concise 2-3 sentence summary for showcase cards. If English is provided, translate and polish into natural, professional Indonesian; if Indonesian is provided, translate to English.
5. **overview** (English) & **overviewId** (Indonesian): Detailed architectural breakdown and purpose. If one is provided, accurately translate and format to the other language.
6. **features** (English array) & **featuresId** (Indonesian array): Translate each feature bullet item. If English is provided, produce the exact 1-to-1 translated array in **featuresId** (Indonesian); if Indonesian is provided, translate to English in **features**. Keep any bold prefixes or formatting aligned.
7. **challenges** (English array) & **challengesId** (Indonesian array): Translate each challenge & solution item. ALWAYS format each item with the Challenge problem on the first line and Solution on the next line using a clear prefix, e.g.:
   - EN: "Challenge 1: [Specific problem]\nSolution: [Implementation details]"
   - ID: "Tantangan 1: [Masalah spesifik]\nSolusi: [Rincian implementasi pemecahan]"
8. **technologies**: Return modern technology array (e.g. ["Laravel 11", "Vue 3", "Inertia.js", "Filament PHP", "Tailwind CSS"]).

Return ONLY valid JSON matching this exact structure:
{
  "subtitle": "string (English)",
  "subtitleId": "string (Indonesian)",
  "role": "string (English)",
  "roleId": "string (Indonesian)",
  "deliveryStatus": "string (English)",
  "deliveryStatusId": "string (Indonesian)",
  "description": "string (English)",
  "descriptionId": "string (Indonesian)",
  "overview": "string (English)",
  "overviewId": "string (Indonesian)",
  "features": ["string (English)"],
  "featuresId": ["string (Indonesian)"],
  "challenges": ["string (English)"],
  "challengesId": ["string (Indonesian)"],
  "technologies": ["string"]
}`;

  return await callGemini(prompt);
}

// 4. Multi-Turn Conversational Chatbot Helper
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithGemini({
  messages,
  systemInstruction,
}: {
  messages: ChatMessage[];
  systemInstruction: string;
}): Promise<string> {
  const apiKey = getApiKey();
  let lastError: any = null;

  // Convert messages to Gemini format
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  for (const modelName of ACTIVE_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const restRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      const restData = await restRes.json();
      if (restData.error) {
        throw new Error(restData.error.message);
      }

      const reply = restData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply.trim();
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`Chat model ${modelName} failed or timed out, trying next:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message || "Failed to generate response from Gemini AI."
  );
}

export async function enhanceCvSectionWithAi(params: {
  type: "summary" | "experience_highlight" | "project_highlight" | "project_description";
  currentText: string;
  roleContext?: string;
  technologiesContext?: string[];
  language: "en" | "id";
}): Promise<string> {
  const isId = params.language === "id";
  const prompt = `You are an elite Tech Career Consultant and ATS Resume Specialist.
Refine, polish, and elevate the following ${params.type.replace(/_/g, " ")} for a Software Engineer / Full Stack Developer CV / resume.

Context Role: ${params.roleContext || "Full Stack Developer & Systems Engineer"}
${params.technologiesContext && params.technologiesContext.length > 0 ? `Technologies Used: ${params.technologiesContext.join(", ")}` : ""}
Target Language: ${isId ? "Bahasa Indonesia (Formal, Profesional, Berbobot, Menggunakan Kata Kerja Aksi Kuat)" : "English (High-impact, Action-oriented, Concise, Professional)"}

Input Content:
"${params.currentText}"

Requirements:
- Transform into 1-2 powerful, well-structured, clear, and impactful professional sentences.
- Use strong active verbs (e.g., Merancang, Mengembangkan, Mengintegrasikan, Mengoptimalkan / Architected, Engineered, Integrated, Deployed).
- Highlight key functionality, system scalability, and technical stack clearly.
- Keep it concise, natural, and suitable for standard A4 CV layout (avoid excessive wordiness or boilerplate).
- Output ONLY the refined plain text directly without quotes, asterisks, bullet marks, or markdown wrappers.`;

  const apiKey = getApiKey();
  for (const modelName of ACTIVE_MODELS) {
    try {
      const restRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const restData = await restRes.json();
      if (restData.error) throw new Error(restData.error.message);

      const rawText = restData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let cleaned = rawText.trim().replace(/^["']|["']$/g, "").trim();
      if (cleaned) return cleaned;
    } catch (err: any) {
      console.warn(`Model ${modelName} failed, trying next fallback:`, err.message);
    }
  }

  throw new Error("Failed to enhance text with Gemini AI.");
}

export async function translateFullCvWithAi(cv: CvData, targetLang: "en" | "id"): Promise<any> {
  const isTargetId = targetLang === "id";
  const prompt = `You are an elite bilingual Tech Resume Consultant and Translator (English <-> Indonesian).
Translate and professionalize all resume fields from ${isTargetId ? "English to Indonesian" : "Indonesian to English"}.

Source Resume Content:
- jobTitle: ${JSON.stringify(isTargetId ? (cv.jobTitle || "") : (cv.jobTitleId || cv.jobTitle || ""))}
- summary: ${JSON.stringify(isTargetId ? (cv.summary || "") : (cv.summaryId || cv.summary || ""))}
- experiences: ${JSON.stringify(
    cv.experiences.map((e: CvExperience) => ({
      id: e.id,
      role: isTargetId ? (e.role || "") : (e.roleId || e.role || ""),
      highlights: isTargetId ? (e.highlights || []) : (e.highlightsId || e.highlights || []),
    }))
  )}
- projects: ${JSON.stringify(
    cv.projects.map((p: CvProjectItem) => ({
      id: p.id,
      role: isTargetId ? (p.role || "") : (p.roleId || p.role || ""),
      description: isTargetId ? (p.description || "") : (p.descriptionId || p.description || ""),
    }))
  )}
- education: ${JSON.stringify(
    cv.education.map((edu: CvEducation) => ({
      id: edu.id,
      degree: isTargetId ? (edu.degree || "") : (edu.degreeId || edu.degree || ""),
      details: isTargetId ? (edu.details || "") : (edu.detailsId || edu.details || ""),
    }))
  )}

Requirements:
- Translate with natural, high-impact phrasing suitable for standard tech resumes.
- Keep technical terms (e.g. Next.js, PostgreSQL, Docker, full-stack, API) consistent.
- Return ONLY valid JSON matching this exact JSON structure:
{
  "jobTitle": "string",
  "summary": "string",
  "experiences": [
    {
      "id": "string",
      "role": "string",
      "highlights": ["string"]
    }
  ],
  "projects": [
    {
      "id": "string",
      "role": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "id": "string",
      "degree": "string",
      "details": "string"
    }
  ]
}`;

  return await callGemini(prompt);
}

export async function generateProposalWithAi(input: {
  projectTitle: string;
  clientName: string;
  clientCompany?: string;
  briefDescription: string;
  estimatedBudget?: number;
  language?: "id" | "en";
}): Promise<{
  title: string;
  summary: string;
  deliverables: { title: string; description: string; features: string[] }[];
  timeline: { phase: string; duration: string; activities: string }[];
  items: { description: string; quantity: number; rate: number }[];
  paymentTerms: string;
  terms: string;
  notes: string;
}> {
  const isId = input.language !== "en";
  const prompt = `You are a Principal Software Engineering Consultant and Senior Tech Solution Architect.
Create a comprehensive, highly persuasive, professional, and structured Technical & Financial Project Proposal for a client.

Client Information:
- Client Name: "${input.clientName}"
- Client Organization/Company: "${input.clientCompany || "-"}"
- Project Title: "${input.projectTitle}"
- Project Brief / Client Requirements: "${input.briefDescription}"
- Estimated Budget/Reference: ${input.estimatedBudget ? `Rp ${input.estimatedBudget}` : "Standard market rate"}
- Language: ${isId ? "Bahasa Indonesia (Formal, Profesional, Berbobot, & Meyakinkan)" : "English (Executive, Professional, & High-Impact)"}

Requirements:
1. **summary**: Executive summary (2-3 paragraphs) detailing the background problem, project objectives, and proposed modern technological solution (e.g. Laravel 11, Next.js, PostgreSQL, Tailwind CSS).
2. **deliverables**: Array of 3-5 structured work modules/scopes. Each module MUST have:
   - title: e.g. "Modul 1: Desain UI/UX & Prototipe Interaktif", "Modul 2: Pengembangan Sistem Backend & Database", etc.
   - description: 1-2 concise sentences explaining the module.
   - features: 3-5 specific feature bullet points.
3. **timeline**: Array of 3-4 sequential project phases/milestones:
   - phase: e.g. "Fase 1: Analisis Kebutuhan & Desain UI/UX"
   - duration: e.g. "3-5 Hari Kerja"
   - activities: summary of activities.
4. **items**: Array of 3-5 itemized cost line items with realistic estimated rates matching the estimated budget:
   - description: e.g. "Desain UI/UX & Responsive Layout", "Pengembangan Fitur & Integrasi Database", "Setup Server, Deployment & QA Testing"
   - quantity: 1
   - rate: number (in IDR or integer matching the total scope)
5. **paymentTerms**: Clear payment scheme (e.g. "DP 50% saat kick-off proyek, 50% setelah serah terima / Go-Live").
6. **terms**: Standard professional terms & conditions (Hak Cipta source code milik klien, Garansi perbaikan bug 30 hari pasca rilis, dll).
7. **notes**: Polite and warm closing notes.

Return ONLY valid JSON matching this exact structure:
{
  "title": "string",
  "summary": "string",
  "deliverables": [
    {
      "title": "string",
      "description": "string",
      "features": ["string"]
    }
  ],
  "timeline": [
    {
      "phase": "string",
      "duration": "string",
      "activities": "string"
    }
  ],
  "items": [
    {
      "description": "string",
      "quantity": 1,
      "rate": 1000000
    }
  ],
  "paymentTerms": "string",
  "terms": "string",
  "notes": "string"
}`;

  return await callGemini(prompt);
}


