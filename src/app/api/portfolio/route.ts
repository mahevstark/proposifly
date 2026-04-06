import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/portfolio — get user's portfolio links */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    "SELECT id, title, url, is_active, category, created_at FROM portfolio_links WHERE user_id = $1 ORDER BY created_at DESC",
    [user.userId]
  );

  return NextResponse.json({ links: result.rows });
}

/** POST /api/portfolio — add a portfolio link */
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, url, category = "web" } = await req.json();

  if (!title || !url) {
    return NextResponse.json(
      { error: "Title and URL are required." },
      { status: 400 }
    );
  }

  const result = await pool.query(
    "INSERT INTO portfolio_links (user_id, title, url, is_active, category) VALUES ($1, $2, $3, true, $4) RETURNING id, title, url, is_active, category, created_at",
    [user.userId, title, url, category]
  );

  return NextResponse.json({ link: result.rows[0] }, { status: 201 });
}

/** DELETE /api/portfolio — delete a portfolio link */
export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  await pool.query(
    "DELETE FROM portfolio_links WHERE id = $1 AND user_id = $2",
    [id, user.userId]
  );

  return NextResponse.json({ success: true });
}

/** PUT /api/portfolio — update a portfolio link */
export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, url, is_active } = await req.json();

  // Toggle active status only
  if (id && is_active !== undefined && !title && !url) {
    const result = await pool.query(
      "UPDATE portfolio_links SET is_active = $1 WHERE id = $2 AND user_id = $3 RETURNING id, title, url, is_active, category, created_at",
      [is_active, id, user.userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }
    return NextResponse.json({ link: result.rows[0] });
  }

  if (!id || !title || !url) {
    return NextResponse.json(
      { error: "ID, title, and URL are required." },
      { status: 400 }
    );
  }

  const result = await pool.query(
    "UPDATE portfolio_links SET title = $1, url = $2 WHERE id = $3 AND user_id = $4 RETURNING id, title, url, is_active, category, created_at",
    [title, url, id, user.userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ link: result.rows[0] });
}
