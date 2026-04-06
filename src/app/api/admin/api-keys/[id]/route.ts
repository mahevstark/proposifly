import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

/** PUT - update key or toggle active */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const { setActive } = await req.json();

  if (setActive) {
    // Deactivate all, then activate this one
    await pool.query("UPDATE api_keys SET is_active = false");
    await pool.query(
      "UPDATE api_keys SET is_active = true, updated_at = NOW() WHERE id = $1",
      [parseInt(id)]
    );
  }

  return NextResponse.json({ success: true });
}

/** DELETE - remove an API key */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await pool.query("DELETE FROM api_keys WHERE id = $1", [parseInt(id)]);

  return NextResponse.json({ success: true });
}
