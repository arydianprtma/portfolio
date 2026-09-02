// Verified active models ordered by speed and availability (tested < 1.5s latency)
const ACTIVE_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
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
  const prompt = `You are an expert software engineering technical author and developer portfolio editor.
You are given partial article information in either English or Indonesian.
Your task is to generate and populate BOTH English and Indonesian versions of all fields completely.

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
1. **title** (English) & **titleId** (Indonesian): Ensure both are compelling, clear, professional developer article titles.
2. **summary** (English) & **summaryId** (Indonesian): If empty, write a crisp, engaging 2-3 sentence summary explaining what readers will learn. If one is provided, polish and translate to the other.
3. **content** (English Markdown) & **contentId** (Indonesian Markdown):
   - If empty or very short, write an informative, high-quality technical article draft in Markdown format with structured sections (e.g., \`## 01. Pendahuluan / Introduction\`, \`## 02. Implementasi / Implementation\`, code snippets \`\`\`ts...\`\`\`, and best practices).
   - If content is already provided, translate and polish into both English and Indonesian, keeping all code and headings aligned.
4. **tags**: Return an array of 3-5 relevant developer tags (e.g. ["JavaScript", "Web Dev", "Tutorial", "Next.js"]).
5. **readingTime**: Estimated reading time string (e.g. "4 min read" or "5 min read").

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
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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

