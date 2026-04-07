import { Tone, PortfolioLink, ProfileLink } from "@/types";

export { callOpenAI, callGroq, callGemini, callClaude } from "./ai-providers";

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web Apps",
  mobile: "Mobile Apps",
  figma: "Figma Designs",
};

function formatPortfolioLinks(portfolioLinks: PortfolioLink[]): string {
  if (portfolioLinks.length === 0) return "No portfolio links provided.";

  const grouped: Record<string, PortfolioLink[]> = {};
  for (const link of portfolioLinks) {
    const cat = link.category || "web";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(link);
  }

  let text = "";
  let counter = 1;
  for (const [cat, items] of Object.entries(grouped)) {
    text += `${CATEGORY_LABELS[cat] || cat}:\n`;
    for (const l of items) {
      text += `${counter}. ${l.title}: ${l.url}\n`;
      counter++;
    }
    text += "\n";
  }
  return text.trim();
}

/** Build the prompt for AI proposal generation */
export function buildPrompt(
  jobDescription: string,
  tone: Tone,
  portfolioLinks: PortfolioLink[],
  profileLinks: ProfileLink[] = [],
  userName: string = "Your Name"
): string {
  const toneInstructions: Record<Tone, string> = {
    formal: "Write in a professional, formal tone.",
    casual: "Write in a friendly, conversational tone.",
    persuasive: "Write in a compelling, persuasive tone that highlights value.",
  };

  const linksText = formatPortfolioLinks(portfolioLinks);

  return `You are a professional proposal writer. ${toneInstructions[tone]}

IMPORTANT RULES:
- STRICTLY FORBIDDEN: Do NOT use asterisks (*), dashes (-), bullet points, or any markdown formatting anywhere in the output. No bold, no ** at all.
- Use plain text ONLY. No formatting characters whatsoever. No dashes at the start of lines. Use line breaks for separation.
- Keep the proposal short and to the point — maximum 150 words.
- Always mention 10+ years of experience.
- Do NOT repeat the full job description back. Just show you understand it briefly.
- Include a "My Approach" section (1-2 lines only) that is SPECIFIC to the job description. Explain exactly how you would build/execute THIS particular project (e.g. "I will start by designing the UI in Figma, then build the frontend in React and integrate with your existing API"). This should make the client feel confident you understand their project and have a clear plan.
- When listing portfolio links, start with a single intro line that mentions ALL the categories present. Examples:
  If only web links: "Here are some of my web applications:"
  If only mobile: "Here are some of my mobile apps:"
  If web + mobile: "Here are some of my web applications and mobile apps:"
  If all three: "Here are some of my web applications, mobile apps, and Figma designs:"
  Then if multiple categories exist, list them under separate sub-headings (Web Apps:, Mobile Apps:, Figma Designs:) with numbered links under each. If only one category, just list the links directly without a sub-heading.
- If profile links are provided, add them AFTER a blank line below the portfolio links. Format each as "Platform: URL" on its own line.
- Include the portfolio link titles exactly as provided (e.g. "1. Project Name: URL").
- Always end the proposal with "Best regards" on one line, then "${userName}" on the next line.

Job Description:
${jobDescription}

Portfolio & Relevant Work:
${linksText}
${profileLinks.length > 0 ? `\nProfiles:\n${profileLinks.map((p) => `${p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}: ${p.url}`).join("\n")}` : ""}

Write the proposal now:`;
}

/** Build prompt for PRD generation */
export function buildPRDPrompt(opts: {
  jobDescription: string;
  proposalText: string;
  budget: string;
  timeline: string;
  clientName: string;
  phases: { number: number; title: string; enabled: boolean }[];
  toolsTechnologies: string;
}): string {
  const enabledPhases = opts.phases.filter((p) => p.enabled);
  const phaseList = enabledPhases.length > 0
    ? enabledPhases.map((p, i) => `Phase ${i + 1}: ${p.title}`).join("\n")
    : "No specific phases defined — create a reasonable phase breakdown.";

  return `You are a professional project manager creating a Project Requirements Document (PRD).

IMPORTANT RULES:
- STRICTLY FORBIDDEN: Do NOT use asterisks (*) anywhere. No bold, no markdown formatting.
- Use plain text ONLY with line breaks and numbering for structure.
- Be detailed but concise. Each section should be actionable.
- Use the proposal and job description as context for the project scope.

Project Details:
${opts.clientName ? `Client: ${opts.clientName}` : ""}
${opts.budget ? `Budget: ${opts.budget}` : ""}
${opts.timeline ? `Timeline: ${opts.timeline}` : ""}
${opts.toolsTechnologies ? `Tools & Technologies: ${opts.toolsTechnologies}` : ""}

Original Job Description:
${opts.jobDescription}

Accepted Proposal:
${opts.proposalText}

Execution Phases:
${phaseList}

Generate a comprehensive PRD with these sections:
1. Project Overview (brief summary, mention client name if provided)
2. Scope of Work (what's included and excluded)
3. Tools & Technologies (list all tools/technologies and explain that the project will be built using them — e.g. "This project will be developed using React, Node.js, PostgreSQL...")
4. Execution Phases (detail each phase with deliverables, milestones, and estimated effort)
5. Total Cost (display the budget as total project cost with breakdown if possible)
6. Timeline (display the timeline with milestones mapped to phases)
7. Acceptance Criteria (how success is measured)
8. Risks and Mitigations
9. Communication Plan

IMPORTANT: Tools & Technologies, Total Cost, and Timeline MUST each have their own dedicated heading/section. Do not skip them even if values are brief.

Write the PRD now:`;
}
