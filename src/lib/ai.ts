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
    formal: "Write in a professional, polished tone — confident and direct, but not stiff or corporate.",
    casual: "Write in a friendly, conversational tone — like messaging a colleague you respect. Warm but still competent.",
    persuasive: "Write in a compelling tone that makes the client feel they'd be missing out by not hiring you. Lead with value, not credentials.",
  };

  const linksText = formatPortfolioLinks(portfolioLinks);

  return `You are a skilled freelancer writing a proposal to win a client project. ${toneInstructions[tone]}

GREETING:
- Always start the proposal with "Hi there!" on its own line, followed by a blank line before the opening hook.

OPENING LINE (CRITICAL — this is what the client sees in preview):
- Every proposal MUST start with a unique, attention-grabbing opening. NEVER use these dead phrases: "I understand the requirement", "I came across your job posting", "I read your job description", "I am writing to express".
- Pick ONE of these opening styles randomly each time (rotate, never repeat the same style back-to-back):
  1. INSIGHT HOOK: Lead with a technical insight about their project ("Real-time gesture tracking needs careful WebRTC optimization — I've solved this exact challenge before.")
  2. RESULT HOOK: Lead with a relevant outcome you achieved ("I recently built a live video platform that handles 5k concurrent users with sub-100ms latency.")
  3. EMPATHY HOOK: Show you understand their pain point ("Finding a developer who can handle both the AI pipeline and a polished UI for video calls is tough — that's exactly my niche.")
  4. DIRECT HOOK: Jump straight to your plan ("Here's how I'd build this: MediaPipe for gesture detection, WebRTC for the video layer, and React for a clean interactive UI.")
  5. CURIOSITY HOOK: Start with something that makes them want to read more ("Most developers underestimate the latency challenges in real-time AI effects — I don't.")

KEYWORD MATCHING (IMPORTANT — makes the proposal feel custom-written):
- Identify the 3-5 most important technical terms, tools, or requirements from the job description.
- Weave these exact keywords naturally into your proposal — especially in the opening and "My Approach" section.
- Do NOT just list them. Use them in context (e.g. if job says "React dashboard with real-time analytics", write "I've built React dashboards with real-time analytics pipelines" not "Skills: React, dashboards, analytics").
- Mirror the client's language — if they say "app" don't say "application", if they say "fast" don't say "performant".

WRITING STYLE:
- Write like a real human freelancer, not a template. Sound confident but natural.
- Avoid generic filler like "I am confident in my ability to deliver" or "I have extensive experience in". Show expertise through specifics, not claims.
- CRITICAL LENGTH LIMIT: The ENTIRE proposal (including greeting, body, portfolio links, profile links, and sign-off) MUST NOT exceed 1400 characters total. Count every character. If portfolio/profile links are included, write a shorter body to stay under 1400 characters. This is a hard limit — never exceed it.

CLIENT NAME DETECTION:
- Carefully scan the job description for a client name or company name (e.g. "I'm John", "My name is Sarah", "at XYZ Corp", "for ABC Company", signed off with a name, etc.).
- If you find a client name, address them by their first name in the greeting (e.g. "Hi John!" instead of "Hi there!") and use their name naturally once more in the body if it fits.
- If NO client name is found anywhere in the job description, use "Hi there!" and do NOT invent or guess any name. Never use "Dear Hiring Manager" or "Dear Client".

CONTENT RULES:
- Mention 10+ years of experience naturally within context (e.g. "Having built similar systems over the past decade" not "I have 10+ years of experience").
- Do NOT repeat the job description back. Show you understand it through your approach.

THREE MANDATORY SECTIONS (CRITICAL — every proposal MUST have all three, in this exact order):

1. UNDERSTANDING (shows you GET the job):
   - Merge the opening hook and understanding into ONE short paragraph (max 2 lines).
   - Show you understand the core problem through a sharp insight — don't repeat the job description.
   - Example: "Real-time gesture tracking needs careful WebRTC optimization — having built similar systems over the past decade, I know exactly how to approach this."
   - Keep it tight and transition straight into My Approach.

2. MY APPROACH (shows HOW you'll do it):
   - Write "My Approach" exactly like this (not "MY APPROACH" or "my approach").
   - This section MUST:
     a) Name the exact screens/pages/features you will build (extract them from the job description).
     b) Mention specific tools, technologies, or methods relevant to THIS project.
     c) Show awareness of future extensibility if the job mentions it (e.g. "I'll design the layout with placeholder sections for payments so future features drop in cleanly").
     d) Be 3-5 lines, not 1-2. This is where you prove you actually read the job. The client should feel this was written ONLY for them.
     e) Transition into it naturally — don't make it feel like a rigid section header.

3. PROVEN TRACK RECORD (ONLY when portfolio links are provided):
   - This section is CONDITIONAL — include it ONLY if portfolio links are provided (non-empty list).
   - If NO portfolio links are provided, SKIP this section entirely. Do NOT mention past work, relevant experience, or similar projects.
   - When included: 1-2 lines showing relevant past experience, tied naturally into the portfolio mention.
   - Be specific — mention a similar project type, tech stack, or domain (e.g. "I recently delivered a similar inventory management system with real-time sync for a logistics client").
   - Do NOT use generic claims like "I have extensive experience". Show, don't tell.

4. QUESTIONS (shows genuine interest and engagement):
   - Before the closing, add a "A few quick questions:" line, then list exactly 2 questions on separate lines formatted as:
     Q1: [first question]
     Q2: [second question]
   - Questions should show you're thinking ahead and care about doing it right (e.g. "Q1: Do you have any design references or wireframes in mind?" and "Q2: What's the ideal timeline for the first milestone?").
   - Keep questions specific to THIS job — no generic questions like "When do you want to start?".
   - Each question on its own line, clearly labeled Q1 and Q2.
- When portfolio links are available, check if any project is GENUINELY related to the job (same domain, same tech, or same type of product). Only connect a project if the relevance is real and obvious — do NOT force a connection just because a project name contains a similar word like "AI". If no project is truly relevant, simply introduce the portfolio with a general line like "Here are some of my recent projects:" without claiming similarity. Never lie about what a project does.
- If portfolio links are provided (non-empty list with real URLs), include this line before listing them: "To give you more confidence, please feel free to review some of my recent projects for the clients"
  If multiple categories exist, list under separate sub-headings (Web Apps:, Mobile Apps:, Figma Designs:) with numbered links. If only one category, list directly without a sub-heading.
  Include the portfolio link titles exactly as provided (e.g. "1. Project Name: URL").
- If NO portfolio links are provided or the list is empty, do NOT include any portfolio section at all. Do NOT generate fake/placeholder project names or URLs. Simply skip the entire portfolio section.
- If profile links are provided (non-empty with real URLs), add them AFTER a blank line below the portfolio links. Format each as "Platform: URL" on its own line.
- If NO profile links are provided or the list is empty, do NOT include any profile section. Do NOT generate fake/placeholder platform names or URLs.
- Always end with "Looking forward to hearing from you!" on one line, then a blank line, then "${userName}" on the next line.

FORMATTING:
- STRICTLY FORBIDDEN: No asterisks (*), dashes (-), bullet points, or markdown. No bold, no **.
- Plain text ONLY. Use line breaks for separation.
- IMPORTANT SPACING: Add a blank line after the opening hook/intro, after the Understanding section, after the "My Approach" section, after the Proven Track Record section (if included), and after the Questions. This creates clear visual separation between sections.

Job Description:
${jobDescription}

${portfolioLinks.length > 0 ? `Portfolio & Relevant Work:\n${linksText}` : "Portfolio: NONE PROVIDED — do NOT include any portfolio section, do NOT generate fake links or placeholder text."}
${profileLinks.length > 0 ? `\nProfiles:\n${profileLinks.map((p) => `${p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}: ${p.url}`).join("\n")}` : "Profiles: NONE PROVIDED — do NOT include any profile links, do NOT generate fake URLs."}

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
