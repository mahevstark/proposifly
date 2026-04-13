import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

/** Cache admin stats for 2 minutes to reduce DB load */
let statsCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(req: NextRequest) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  // Return cached stats if fresh
  if (statsCache && Date.now() - statsCache.timestamp < CACHE_TTL) {
    return NextResponse.json(statsCache.data);
  }

  const [users, proposals, prds, todayProposals, activeProvider, dailyProposals, toneBreakdown, recentUsers] =
    await Promise.all([
      pool.query("SELECT COUNT(*)::int as count FROM users"),
      pool.query("SELECT COUNT(*)::int as count FROM proposals"),
      pool.query("SELECT COUNT(*)::int as count FROM prds"),
      pool.query(
        "SELECT COUNT(*)::int as count FROM proposals WHERE created_at >= CURRENT_DATE"
      ),
      pool.query(
        "SELECT provider FROM api_keys WHERE is_active = true LIMIT 1"
      ),
      // Last 7 days proposals count per day
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*)::int as count
        FROM proposals
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `),
      // Tone breakdown
      pool.query(`
        SELECT tone, COUNT(*)::int as count
        FROM proposals
        GROUP BY tone
        ORDER BY count DESC
      `),
      // Last 7 days signups per day
      pool.query(`
        SELECT DATE(created_at) as date, COUNT(*)::int as count
        FROM users
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `),
    ]);

  // Fill in missing days for daily data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split("T")[0]);
  }

  const proposalsByDay = last7Days.map((date) => {
    const found = dailyProposals.rows.find(
      (r: { date: Date }) => new Date(r.date).toISOString().split("T")[0] === date
    );
    return { date, proposals: found?.count || 0 };
  });

  const usersByDay = last7Days.map((date) => {
    const found = recentUsers.rows.find(
      (r: { date: Date }) => new Date(r.date).toISOString().split("T")[0] === date
    );
    return { date, users: found?.count || 0 };
  });

  const result = {
    totalUsers: users.rows[0].count,
    totalProposals: proposals.rows[0].count,
    totalPRDs: prds.rows[0].count,
    todayProposals: todayProposals.rows[0].count,
    activeProvider:
      activeProvider.rows[0]?.provider ||
      process.env.AI_PROVIDER ||
      "none",
    proposalsByDay,
    usersByDay,
    toneBreakdown: toneBreakdown.rows,
  };

  // Cache the result
  statsCache = { data: result, timestamp: Date.now() };

  return NextResponse.json(result);
}
