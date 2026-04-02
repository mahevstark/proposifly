import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://apple@localhost:5432/proposify",
});

export default pool;
