import { NextRequest, NextResponse } from "next/server";
import { GenerateProposalRequest, PortfolioLink, ProfileLink } from "@/types";
import { buildPrompt } from "@/lib/ai";
import { callOpenAI, callClaude, callGemini, callGroq } from "@/lib/ai-providers";
import { getActiveProvider, getApiKey } from "@/lib/ai-keys";

interface RequestBody extends GenerateProposalRequest {
  profileLinks?: ProfileLink[];
  userName?: string;
}

/** Generate a dummy proposal for testing */
function generateDummyProposal(
  jobDescription: string,
  tone: string,
  portfolioLinks: PortfolioLink[],
  profileLinks: ProfileLink[],
  userName: string
): string {
  const toneStyle: Record<string, string> = {
    formal: "I am writing to express my strong interest in",
    casual: "Hey there! I'd love to help you with",
    persuasive: "Let me show you exactly why I'm the perfect fit for",
  };

  const intro = toneStyle[tone] || toneStyle.formal;
  const jobSnippet = jobDescription.slice(0, 100).trim();

  let proposal = `Dear Hiring Manager,

${intro} this opportunity. After reviewing your requirements, I'm confident my skills align perfectly with what you need.

I understand you're looking for someone to handle "${jobSnippet}..." — I have 10+ years of experience delivering similar projects on time and within budget.

My Approach:
I'll start by understanding your requirements for "${jobSnippet}...", then build a structured solution tailored to your needs and iterate with your feedback until the result exceeds your expectations.

I can start immediately and deliver within 2-3 weeks. I'm flexible on budget and happy to discuss a rate that works for both of us.`;

  if (portfolioLinks.length > 0) {
    const grouped: Record<string, typeof portfolioLinks> = {};
    for (const link of portfolioLinks) {
      const cat = link.category || "web";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(link);
    }
    const catNames: Record<string, string> = { web: "web applications", mobile: "mobile apps", figma: "Figma designs" };
    const categories = Object.keys(grouped);
    const catList = categories.map(c => catNames[c] || c);
    let intro = "Here are some of my ";
    if (catList.length === 1) {
      intro += catList[0];
    } else if (catList.length === 2) {
      intro += `${catList[0]} and ${catList[1]}`;
    } else {
      intro += catList.slice(0, -1).join(", ") + ", and " + catList[catList.length - 1];
    }
    proposal += `\n\n${intro}:`;
    const catHeadings: Record<string, string> = { web: "Web Apps", mobile: "Mobile Apps", figma: "Figma Designs" };
    let counter = 1;
    for (const [cat, items] of Object.entries(grouped)) {
      if (categories.length > 1) {
        proposal += `\n\n${catHeadings[cat] || cat}:`;
      }
      for (const link of items) {
        proposal += `\n${counter}. ${link.title}: ${link.url}`;
        counter++;
      }
    }
  }

  if (profileLinks.length > 0) {
    proposal += `\n\nYou can also find me on:`;
    profileLinks.forEach((profile) => {
      proposal += `\n${profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}: ${profile.url}`;
    });
  }

  proposal += `\n\nLooking forward to discussing this further.

Best regards,
${userName}`;

  return proposal;
}

/** POST /api/generateProposal — generates a proposal via AI (falls back to dummy) */
export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    /* Validate input */
    if (!body.jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const tone = body.tone || "formal";
    const portfolioLinks = body.portfolioLinks || [];
    const profileLinks = body.profileLinks || [];
    const userName = body.userName || "Your Name";

    /* Try AI first, fall back to dummy */
    // Check DB for active provider first, then fallback to .env
    const dbProvider = await getActiveProvider();
    const provider = dbProvider?.provider || (process.env.AI_PROVIDER || "openai").trim();
    let proposal: string;

    try {
      const prompt = buildPrompt(body.jobDescription, tone, portfolioLinks, profileLinks, userName);
      const key = dbProvider?.apiKey || await getApiKey(provider);

      if (provider === "groq" && key) {
        process.env.GROQ_API_KEY = key;
        proposal = await callGroq(prompt);
      } else if (provider === "gemini" && key) {
        process.env.GEMINI_API_KEY = key;
        proposal = await callGemini(prompt);
      } else if (provider === "claude" && key) {
        process.env.ANTHROPIC_API_KEY = key;
        proposal = await callClaude(prompt);
      } else if (provider === "openai" && key) {
        process.env.OPENAI_API_KEY = key;
        proposal = await callOpenAI(prompt);
      } else {
        proposal = generateDummyProposal(body.jobDescription, tone, portfolioLinks, profileLinks, userName);
      }
    } catch (aiErr: unknown) {
      const aiMsg = aiErr instanceof Error ? aiErr.message : "Unknown AI error";
      console.error(`AI API failed (provider: ${provider}):`, aiMsg);
      proposal = generateDummyProposal(body.jobDescription, tone, portfolioLinks, profileLinks, userName);
    }

    // Strip any markdown formatting (asterisks, hashes, etc.)
    proposal = proposal.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^#{1,6}\s/gm, "").replace(/^[-•]\s+/gm, "");

    return NextResponse.json({ proposal });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Generate proposal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
