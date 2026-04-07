import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/admin/maintenance — get maintenance mode status (admin only) */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [user.userId]);
  if (userResult.rows[0]?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await pool.query("SELECT value FROM site_settings WHERE key = 'maintenance_mode'");
  const enabled = result.rows[0]?.value === "true";

  return NextResponse.json({ maintenance: enabled });
}

/** PUT /api/admin/maintenance — manually toggle maintenance mode (admin only) */
export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [user.userId]);
  if (userResult.rows[0]?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { enabled } = await req.json();
  const value = enabled ? "true" : "false";

  await pool.query(
    "INSERT INTO site_settings (key, value, updated_at) VALUES ('maintenance_mode', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
    [value]
  );

  return NextResponse.json({ maintenance: enabled });
}
