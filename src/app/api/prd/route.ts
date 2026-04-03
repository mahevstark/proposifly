import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { buildPRDPrompt, callGroq, callGemini, callOpenAI, callClaude } from "@/lib/ai";

/** POST /api/prd — generate and save a PRD */
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { proposalId, budget, timeline, clientName, phases, toolsTechnologies } = await req.json();

    if (!proposalId) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 });
    }

    // Get the proposal
    const proposalResult = await pool.query(
      `SELECT job_description, proposal_text FROM proposals WHERE id = $1 AND user_id = $2`,
      [proposalId, user.userId]
    );

    if (proposalResult.rows.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const proposal = proposalResult.rows[0];

    // Build PRD prompt and generate
    const prompt = buildPRDPrompt({
      jobDescription: proposal.job_description,
      proposalText: proposal.proposal_text,
      budget: budget || "",
      timeline: timeline || "",
      clientName: clientName || "",
      phases: phases || [],
      toolsTechnologies: toolsTechnologies || "",
    });

    let prdText: string;
    const provider = process.env.AI_PROVIDER || "openai";

    try {
      if (provider === "groq" && process.env.GROQ_API_KEY) {
        prdText = await callGroq(prompt);
      } else if (provider === "gemini" && process.env.GEMINI_API_KEY) {
        prdText = await callGemini(prompt);
      } else if (provider === "claude" && process.env.ANTHROPIC_API_KEY) {
        prdText = await callClaude(prompt);
      } else if (process.env.OPENAI_API_KEY) {
        prdText = await callOpenAI(prompt);
      } else {
        prdText = generateDummyPRD(proposal.job_description, phases, budget, timeline, clientName, toolsTechnologies);
      }
    } catch {
      console.log("AI API failed for PRD, using dummy");
      prdText = generateDummyPRD(proposal.job_description, phases, budget, timeline, clientName, toolsTechnologies);
    }

    // Strip markdown formatting
    prdText = prdText.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^#{1,6}\s/gm, "");

    // Save to DB
    const result = await pool.query(
      `INSERT INTO prds (proposal_id, user_id, budget, timeline, client_name, phases, tools_technologies, prd_text)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at`,
      [proposalId, user.userId, budget || null, timeline || null, clientName || null, JSON.stringify(phases || []), toolsTechnologies || null, prdText]
    );

    return NextResponse.json({
      id: result.rows[0].id,
      prd_text: prdText,
      created_at: result.rows[0].created_at,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("PRD generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateDummyPRD(
  jobDescription: string,
  phases: { number: number; title: string; enabled: boolean }[],
  budget: string,
  timeline: string,
  clientName: string,
  toolsTechnologies: string
): string {
  const enabledPhases = (phases || []).filter((p) => p.enabled);
  const jobSnippet = jobDescription.slice(0, 150).trim();

  let prd = `PROJECT REQUIREMENTS DOCUMENT (PRD)\n`;

  prd += `\nProject Overview\n`;
  if (clientName) prd += `Client: ${clientName}\n`;
  prd += `This document outlines the requirements and execution plan for the project: "${jobSnippet}..." based on the accepted proposal.\n`;

  prd += `\nScope of Work\n`;
  prd += `- Full development as outlined in the accepted proposal.\n`;
  prd += `- Includes design, development, testing, and deployment.\n`;

  if (toolsTechnologies) {
    prd += `\nTools & Technologies\n`;
    prd += `This project will be developed using ${toolsTechnologies}. These technologies have been selected to ensure scalability, performance, and maintainability of the final product.\n`;
  }

  if (enabledPhases.length > 0) {
    prd += `\nExecution Phases\n`;
    enabledPhases.forEach((phase, i) => {
      prd += `\nPhase ${i + 1}: ${phase.title}\n`;
      prd += `- Deliverables and milestones for this phase will be defined during kickoff.\n`;
      prd += `- Estimated completion within the agreed timeline.\n`;
    });
  }

  if (budget) {
    prd += `\nTotal Cost\n`;
    prd += `The total project cost is ${budget}. Payment milestones will be tied to phase completions.\n`;
  }

  if (timeline) {
    prd += `\nTimeline\n`;
    prd += `The estimated project timeline is ${timeline}. Each phase milestone will be tracked against this schedule.\n`;
  }

  prd += `\nAcceptance Criteria\n- All deliverables match the specifications outlined above.\n- Client approval at each phase milestone.\n- Final delivery includes documentation and handoff.\n`;
  prd += `\nRisks and Mitigations\n- Scope creep: Managed through clear phase definitions.\n- Timeline delays: Buffer built into each phase.\n`;
  prd += `\nCommunication Plan\n- Weekly progress updates.\n- Phase completion reviews with client.\n- Dedicated communication channel for quick queries.\n`;

  return prd;
}
