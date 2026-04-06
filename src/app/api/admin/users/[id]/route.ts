import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const userId = parseInt(id);

  const userResult = await pool.query(
    "SELECT id, name, email, COALESCE(role, 'user') as role, created_at FROM users WHERE id = $1",
    [userId]
  );

  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const tab = url.searchParams.get("tab") || "proposals";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const prdCountResult = await pool.query(
    "SELECT COUNT(*)::int as total FROM prds WHERE user_id = $1",
    [userId]
  );
  const prdCount = prdCountResult.rows[0].total;

  if (tab === "prds") {
    const [prdsResult, countResult] = await Promise.all([
      pool.query(
        `SELECT prds.id, prds.proposal_id, prds.budget, prds.timeline, prds.client_name,
                prds.phases, prds.tools_technologies, prds.prd_text, prds.created_at,
                proposals.job_title
         FROM prds JOIN proposals ON prds.proposal_id = proposals.id
         WHERE prds.user_id = $1 ORDER BY prds.created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      ),
      pool.query("SELECT COUNT(*)::int as total FROM prds WHERE user_id = $1", [userId]),
    ]);
    return NextResponse.json({
      user: userResult.rows[0],
      prds: prdsResult.rows,
      total: countResult.rows[0].total,
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit),
      prdCount,
    });
  }

  const [proposalsResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id, job_title, job_description, proposal_text, tone, created_at
       FROM proposals WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ),
    pool.query("SELECT COUNT(*)::int as total FROM proposals WHERE user_id = $1", [userId]),
  ]);

  return NextResponse.json({
    user: userResult.rows[0],
    proposals: proposalsResult.rows,
    total: countResult.rows[0].total,
    page,
    totalPages: Math.ceil(countResult.rows[0].total / limit),
    prdCount,
  });
}
