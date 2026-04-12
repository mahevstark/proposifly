import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

/** DELETE /api/admin/proposals/[id] — admin deletes any proposal */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  try {
    // Delete related PRDs first
    await pool.query(`DELETE FROM prds WHERE proposal_id = $1`, [params.id]);
    const result = await pool.query(
      `DELETE FROM proposals WHERE id = $1 RETURNING id`,
      [params.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
