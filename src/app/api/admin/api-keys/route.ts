import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/admin-auth";

/** GET - list all API keys (masked) */
export async function GET(req: NextRequest) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const result = await pool.query(
    "SELECT id, provider, api_key, is_active, created_at, updated_at FROM api_keys ORDER BY provider"
  );

  const keys = result.rows.map((row) => ({
    ...row,
    api_key_masked: maskKey(row.api_key),
  }));

  // Also return .env keys info so admin can see what's hardcoded
  const envKeys = [
    { provider: "openai", hasKey: !!process.env.OPENAI_API_KEY, masked: maskKey(process.env.OPENAI_API_KEY || "") },
    { provider: "groq", hasKey: !!process.env.GROQ_API_KEY, masked: maskKey(process.env.GROQ_API_KEY || "") },
    { provider: "gemini", hasKey: !!process.env.GEMINI_API_KEY, masked: maskKey(process.env.GEMINI_API_KEY || "") },
    { provider: "claude", hasKey: !!process.env.ANTHROPIC_API_KEY, masked: maskKey(process.env.ANTHROPIC_API_KEY || "") },
  ].filter((e) => e.hasKey);

  const envProvider = process.env.AI_PROVIDER || "none";

  return NextResponse.json({ keys, envKeys, envProvider });
}

/** POST - add or update an API key */
export async function POST(req: NextRequest) {
  const auth = await getAdminFromRequest(req);
  if ("error" in auth) return auth.error;

  const { provider, apiKey, setActive } = await req.json();
  const validProviders = ["openai", "groq", "gemini", "claude"];

  if (!validProviders.includes(provider)) {
    return NextResponse.json(
      { error: `Provider must be one of: ${validProviders.join(", ")}` },
      { status: 400 }
    );
  }

  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "API key is required" },
      { status: 400 }
    );
  }

  // Upsert the key
  const result = await pool.query(
    `INSERT INTO api_keys (provider, api_key, is_active, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (provider)
     DO UPDATE SET api_key = $2, is_active = $3, updated_at = NOW()
     RETURNING id, provider, is_active`,
    [provider, apiKey.trim(), setActive || false]
  );

  // If setting active, deactivate others
  if (setActive) {
    await pool.query(
      "UPDATE api_keys SET is_active = false WHERE provider != $1",
      [provider]
    );
  }

  return NextResponse.json({ key: result.rows[0] });
}

function maskKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}
