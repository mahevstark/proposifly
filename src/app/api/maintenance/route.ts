import { NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/maintenance — public endpoint to check maintenance status */
export async function GET() {
  try {
    const result = await pool.query("SELECT value FROM site_settings WHERE key = 'maintenance_mode'");
    const enabled = result.rows[0]?.value === "true";
    return NextResponse.json({ maintenance: enabled });
  } catch {
    return NextResponse.json({ maintenance: false });
  }
}
