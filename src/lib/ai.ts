import { Tone, PortfolioLink, ProfileLink } from "@/types";

/** Build the prompt for AI proposal generation */
export function buildPrompt(
  jobDescription: string,
  tone: Tone,
  portfolioLinks: PortfolioLink[],
  profileLinks: ProfileLink[] = []
): string {
  const toneInstructions: Record<Tone, string> = {
    formal: "Write in a professional, formal tone.",
    casual: "Write in a friendly, conversational tone.",
    persuasive: "Write in a compelling, persuasive tone that highlights value.",
  };

  const linksText = portfolioLinks.length
    ? portfolioLinks.map((l, i) => `${i + 1}. ${l.title}: ${l.url}`).join("\n")
    : "No portfolio links provided.";

  return `You are a professional proposal writer. ${toneInstructions[tone]}

IMPORTANT RULES:
- STRICTLY FORBIDDEN: Do NOT use asterisks (*) anywhere in the output. No bold, no markdown, no ** at all.
- Use plain text ONLY. No formatting characters whatsoever. Use line breaks for separation.
- Keep the proposal short and to the point — maximum 150 words.
- Always mention 10+ years of experience.
- Do NOT repeat the full job description back. Just show you understand it briefly.
- End with the portfolio links listed with numbering.
- If profile links are provided, add them AFTER a blank line below the portfolio links. Format each as "Platform: URL" on its own line.
- Include the portfolio link titles exactly as provided (e.g. "1. Project Name: URL").
- Always end the proposal with "Best regards" on one line, then "Badar Madni" on the next line.

Job Description:
${jobDescription}

Portfolio & Relevant Work:
${linksText}
${profileLinks.length > 0 ? `\nProfiles:\n${profileLinks.map((p) => `${p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}: ${p.url}`).join("\n")}` : ""}

Write the proposal now:`;
}

/** Call OpenAI GPT-4 API */
export async function callOpenAI(prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

/** Call Groq API (Llama 3) */
export async function callGroq(prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

/** Call Google Gemini API */
export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

/** Call Anthropic Claude API */
export async function callClaude(prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Claude API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content[0]?.text?.trim() || "";
}
