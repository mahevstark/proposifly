import { NextResponse } from "next/server";

/** GET /api/debug — check if env vars are set (does NOT expose values) */
export async function GET() {
  return NextResponse.json({
    AI_PROVIDER: process.env.AI_PROVIDER || "NOT SET",
    GROQ_KEY_SET: !!process.env.GROQ_API_KEY,
    GROQ_KEY_LENGTH: process.env.GROQ_API_KEY?.length || 0,
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
  });
}
