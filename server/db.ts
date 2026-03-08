import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (process.env.DATABASE_URL.includes("[YOUR-PASSWORD]")) {
  throw new Error(
    "DATABASE_URL still contains [YOUR-PASSWORD]. Replace it with your real database password.",
  );
}

try {
  new URL(process.env.DATABASE_URL);
} catch {
  throw new Error(
    "DATABASE_URL is not a valid URL. If your password has special characters, URL-encode it.",
  );
}

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render + Supabase pooler can fail TLS verification unless this is explicit.
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(pool, { schema });
