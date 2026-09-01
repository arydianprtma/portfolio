import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel(modelName = "gemini-1.5-flash") {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env. Please get a free API key at https://aistudio.google.com and add GEMINI_API_KEY=your_key to .env"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

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
  const model = getGeminiModel("gemini-1.5-flash");

  const fromLanguageName = sourceLang === "en" ? "English" : "Indonesian (Bahasa Indonesia)";
  const toLanguageName = targetLang === "en" ? "English" : "Indonesian (Bahasa Indonesia)";

  const prompt = `You are an expert technical translator and developer portfolio editor.
Translate the following JSON fields from ${fromLanguageName} to ${toLanguageName}.

Context: ${context}.
Target audience: High-end technology recruiters, enterprise software clients, and design agencies.
Requirements:
1. Maintain high technical precision, professional tone, and natural phrasing.
2. Keep technical terms, acronyms, framework names (e.g. Next.js, TypeScript, PostgreSQL, GSAP, Docker, GraphQL, API) intact unless a natural Indonesian equivalent is standard.
3. Preserve all Markdown formatting, code snippets, lists, and line breaks exactly.
4. Output MUST be valid JSON matching the exact keys provided in the input, with translated string or string array values.
5. Return ONLY the raw JSON object, without any surrounding markdown code fences (\`\`\`json).

Input fields to translate:
${JSON.stringify(fields, null, 2)}`;

  const response = await model.generateContent(prompt);
  const text = response.response.text().trim();

  // Clean any markdown codeblock formatting if returned
  let cleaned = text;
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini translation output:", text);
    throw new Error("Failed to parse AI translation output. Please try again.");
  }
}
