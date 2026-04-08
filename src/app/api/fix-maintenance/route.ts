import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/** Temporary endpoint to clear maintenance mode — remove after use */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("key");
  if (secret !== "fix2024clear") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await pool.query(
    "INSERT INTO site_settings (key, value, updated_at) VALUES ('maintenance_mode', 'false', NOW()) ON CONFLICT (key) DO UPDATE SET value = 'false', updated_at = NOW()"
  );

  return NextResponse.json({ maintenance: false, message: "Maintenance mode cleared" });
}
