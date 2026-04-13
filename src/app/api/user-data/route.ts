import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/user-data — combined endpoint for portfolio, preferences, and profiles */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [portfolioResult, preferencesResult, profilesResult] = await Promise.all([
    pool.query(
      "SELECT id, title, url, is_active, category, created_at FROM portfolio_links WHERE user_id = $1 ORDER BY created_at DESC",
      [user.userId]
    ),
    pool.query(
      "SELECT default_tone FROM user_preferences WHERE user_id = $1",
      [user.userId]
    ),
    pool.query(
      "SELECT id, platform, url, is_active, created_at FROM user_profiles WHERE user_id = $1 ORDER BY created_at DESC",
      [user.userId]
    ),
  ]);

  return NextResponse.json({
    links: portfolioResult.rows,
    tone: preferencesResult.rows[0]?.default_tone || "formal",
    profiles: profilesResult.rows,
  });
}
