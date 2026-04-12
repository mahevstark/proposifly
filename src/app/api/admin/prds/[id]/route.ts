import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

/** DELETE /api/admin/prds/[id] — admin deletes any PRD */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  try {
    const result = await pool.query(
      `DELETE FROM prds WHERE id = $1 RETURNING id`,
      [params.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "PRD not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
