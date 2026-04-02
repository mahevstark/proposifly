import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/auth/me — get current logged-in user */
export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const result = await pool.query(
    "SELECT id, email, name FROM users WHERE id = $1",
    [payload.userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: result.rows[0] });
}

/** POST /api/auth/me — logout (clear cookie) */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
