import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export interface AdminUser {
  userId: number;
  email: string;
  role: string;
}

/** Verify request is from an admin user. Returns admin user or error response. */
export async function getAdminFromRequest(
  req: NextRequest
): Promise<{ admin: AdminUser } | { error: NextResponse }> {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const result = await pool.query(
    "SELECT id, email, role FROM users WHERE id = $1",
    [payload.userId]
  );

  if (result.rows.length === 0) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 401 }),
    };
  }

  const user = result.rows[0];
  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
    };
  }

  return {
    admin: { userId: user.id, email: user.email, role: user.role },
  };
}
