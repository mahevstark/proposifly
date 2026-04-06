import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/auth";

/** POST - create a new admin user */
export async function POST(req: NextRequest) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const { name, email, password } = await req.json();

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, 'admin')
     RETURNING id, email, name, role`,
    [email.toLowerCase(), passwordHash, name.trim()]
  );

  // Create default preferences
  await pool.query(
    "INSERT INTO user_preferences (user_id) VALUES ($1)",
    [result.rows[0].id]
  );

  return NextResponse.json({ user: result.rows[0] });
}
