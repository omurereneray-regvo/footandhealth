import { Pool } from 'pg';

let pool: Pool | undefined;

export function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

let schemaPromise: Promise<void> | undefined;
export function ensureSchema() {
  schemaPromise ??= database().query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      password_hash TEXT,
      google_subject TEXT UNIQUE,
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
      health_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
      age TEXT NOT NULL DEFAULT '', gender TEXT NOT NULL DEFAULT '', height TEXT NOT NULL DEFAULT '',
      weight TEXT NOT NULL DEFAULT '', activity TEXT NOT NULL DEFAULT '', goal TEXT NOT NULL DEFAULT '',
      target_weight TEXT NOT NULL DEFAULT '', avatar_url TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE scan_history ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES app_users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS scan_history_user_scanned_at_idx ON scan_history (user_id, scanned_at DESC);
  `).then(() => undefined);
  return schemaPromise;
}
