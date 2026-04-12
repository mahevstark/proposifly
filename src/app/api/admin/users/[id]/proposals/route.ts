import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

/** DELETE /api/admin/users/[id]/proposals — delete all proposals (and their PRDs) for a user */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  try {
    // Delete all PRDs linked to this user's proposals first
    await pool.query(`DELETE FROM prds WHERE user_id = $1`, [params.id]);
    // Delete all proposals
    const result = await pool.query(
      `DELETE FROM proposals WHERE user_id = $1`,
      [params.id]
    );

    return NextResponse.json({ success: true, deleted: result.rowCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
