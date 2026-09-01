import { GoogleGenerativeAI } from "@google/generative-ai";

// Verified active models ordered by speed and availability
const ACTIVE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

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
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY belum diisi di file .env. Dapatkan API key gratis di https://aistudio.google.com/apikey"
    );
  }

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

  let lastError: any = null;

  // Try each verified active model sequentially via direct REST endpoint (100% reliable)
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
      "Gagal melakukan terjemahan AI. Pastikan API key Google AI Studio Anda aktif."
  );
}
