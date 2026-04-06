import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const search = url.searchParams.get("search") || "";
  const offset = (page - 1) * limit;

  let whereClause = "";
  const params: (string | number)[] = [];

  if (search) {
    whereClause = "WHERE u.name ILIKE $1 OR u.email ILIKE $1";
    params.push(`%${search}%`);
  }

  const countQuery = `SELECT COUNT(*)::int as total FROM users u ${whereClause}`;
  const countResult = await pool.query(countQuery, params);
  const total = countResult.rows[0].total;

  const dataQuery = `
    SELECT u.id, u.name, u.email, COALESCE(u.role, 'user') as role,
           COUNT(p.id)::int as proposal_count,
           u.created_at
    FROM users u
    LEFT JOIN proposals p ON p.user_id = u.id
    ${whereClause}
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const dataResult = await pool.query(dataQuery, [
    ...params,
    limit,
    offset,
  ]);

  return NextResponse.json({
    users: dataResult.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
