import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** POST /api/proposals — save a generated proposal */
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobTitle, jobDescription, proposalText, tone } = await req.json();

    if (!jobDescription || !proposalText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO proposals (user_id, job_title, job_description, proposal_text, tone)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [user.userId, jobTitle || null, jobDescription, proposalText, tone || "formal"]
    );

    return NextResponse.json({ id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Save proposal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** GET /api/proposals — list user's proposals with optional filters */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const tone = url.searchParams.get("tone") || "";
    const sort = url.searchParams.get("sort") || "newest";

    let query = `SELECT id, job_title, job_description, proposal_text, tone, created_at
                 FROM proposals WHERE user_id = $1`;
    const params: (string | number)[] = [user.userId];
    let paramIndex = 2;

    if (search) {
      query += ` AND (job_title ILIKE $${paramIndex} OR job_description ILIKE $${paramIndex} OR proposal_text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (tone && tone !== "all") {
      query += ` AND tone = $${paramIndex}`;
      params.push(tone);
      paramIndex++;
    }

    query += sort === "oldest" ? ` ORDER BY created_at ASC` : ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json({ proposals: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("List proposals error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
