import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/preferences — get user's default tone */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    "SELECT default_tone FROM user_preferences WHERE user_id = $1",
    [user.userId]
  );

  const tone = result.rows[0]?.default_tone || "formal";
  return NextResponse.json({ tone });
}

/** PUT /api/preferences — update default tone */
export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tone } = await req.json();

  await pool.query(
    "INSERT INTO user_preferences (user_id, default_tone) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET default_tone = $2",
    [user.userId, tone]
  );

  return NextResponse.json({ tone });
}
