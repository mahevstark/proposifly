import { NextRequest, NextResponse } from "next/server";
import { SavePortfolioRequest } from "@/types";

/**
 * POST /api/savePortfolio — placeholder for server-side portfolio storage.
 * Currently returns success; integrate with a DB (Prisma, Supabase, etc.) as needed.
 */
export async function POST(req: NextRequest) {
  try {
    const body: SavePortfolioRequest = await req.json();

    if (!Array.isArray(body.links)) {
      return NextResponse.json(
        { error: "Invalid portfolio data." },
        { status: 400 }
      );
    }

    /* TODO: Save to database here */
    // Example: await db.portfolio.upsert({ userId, links: body.links });

    return NextResponse.json({
      success: true,
      message: `Saved ${body.links.length} portfolio link(s).`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save portfolio." },
      { status: 500 }
    );
  }
}
