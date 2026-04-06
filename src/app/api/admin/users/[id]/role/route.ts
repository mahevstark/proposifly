import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const targetId = parseInt(id);
  const { role } = await req.json();

  if (!["admin", "user"].includes(role)) {
    return NextResponse.json(
      { error: "Role must be 'admin' or 'user'" },
      { status: 400 }
    );
  }

  // Prevent self-demotion
  if (targetId === auth.admin.userId && role === "user") {
    return NextResponse.json(
      { error: "You cannot demote yourself" },
      { status: 400 }
    );
  }

  await pool.query("UPDATE users SET role = $1 WHERE id = $2", [
    role,
    targetId,
  ]);

  return NextResponse.json({ success: true });
}
