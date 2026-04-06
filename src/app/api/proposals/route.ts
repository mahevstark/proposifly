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
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = 7;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE user_id = $1`;
    const params: (string | number)[] = [user.userId];
    let paramIndex = 2;

    if (search) {
      whereClause += ` AND (job_title ILIKE $${paramIndex} OR job_description ILIKE $${paramIndex} OR proposal_text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (tone && tone !== "all") {
      whereClause += ` AND tone = $${paramIndex}`;
      params.push(tone);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM proposals ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const orderBy = sort === "oldest" ? `ORDER BY created_at ASC` : `ORDER BY created_at DESC`;
    const dataQuery = `SELECT id, job_title, job_description, proposal_text, tone, created_at
                       FROM proposals ${whereClause} ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(dataQuery, params);
    return NextResponse.json({ proposals: result.rows, totalCount, page, totalPages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("List proposals error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
