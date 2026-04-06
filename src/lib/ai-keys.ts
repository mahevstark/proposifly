import pool from "@/lib/db";

interface DbKeyResult {
  provider: string;
  apiKey: string;
}

/** Get the active AI provider and key from DB, fallback to .env */
export async function getActiveProvider(): Promise<DbKeyResult | null> {
  try {
    const result = await pool.query(
      "SELECT provider, api_key FROM api_keys WHERE is_active = true LIMIT 1"
    );
    if (result.rows.length > 0) {
      return {
        provider: result.rows[0].provider,
        apiKey: result.rows[0].api_key,
      };
    }
  } catch {
    // Table might not exist yet, fall through to .env
  }
  return null;
}

/** Get API key for a specific provider from DB, fallback to .env */
export async function getApiKey(provider: string): Promise<string | null> {
  try {
    const result = await pool.query(
      "SELECT api_key FROM api_keys WHERE provider = $1 LIMIT 1",
      [provider]
    );
    if (result.rows.length > 0) return result.rows[0].api_key;
  } catch {
    // Fall through to .env
  }

  const envMap: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    claude: process.env.ANTHROPIC_API_KEY,
  };

  return envMap[provider] || null;
}
