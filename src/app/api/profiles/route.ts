import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/profiles — get user's profile links */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    "SELECT id, platform, url, is_active, created_at FROM user_profiles WHERE user_id = $1 ORDER BY created_at DESC",
    [user.userId]
  );

  return NextResponse.json({ profiles: result.rows });
}

/** POST /api/profiles — add a profile link */
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { platform, url } = await req.json();

  if (!platform || !url) {
    return NextResponse.json(
      { error: "Platform and URL are required." },
      { status: 400 }
    );
  }

  const result = await pool.query(
    "INSERT INTO user_profiles (user_id, platform, url, is_active) VALUES ($1, $2, $3, true) RETURNING id, platform, url, is_active, created_at",
    [user.userId, platform, url]
  );

  return NextResponse.json({ profile: result.rows[0] }, { status: 201 });
}

/** PUT /api/profiles — update or toggle a profile */
export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, platform, url, is_active } = await req.json();

  // Toggle active status only
  if (id && is_active !== undefined && !platform && !url) {
    const result = await pool.query(
      "UPDATE user_profiles SET is_active = $1 WHERE id = $2 AND user_id = $3 RETURNING id, platform, url, is_active, created_at",
      [is_active, id, user.userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }
    return NextResponse.json({ profile: result.rows[0] });
  }

  if (!id || !platform || !url) {
    return NextResponse.json(
      { error: "ID, platform, and URL are required." },
      { status: 400 }
    );
  }

  const result = await pool.query(
    "UPDATE user_profiles SET platform = $1, url = $2 WHERE id = $3 AND user_id = $4 RETURNING id, platform, url, is_active, created_at",
    [platform, url, id, user.userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ profile: result.rows[0] });
}

/** DELETE /api/profiles — delete a profile link */
export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  await pool.query(
    "DELETE FROM user_profiles WHERE id = $1 AND user_id = $2",
    [id, user.userId]
  );

  return NextResponse.json({ success: true });
}
