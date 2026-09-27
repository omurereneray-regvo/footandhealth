import { Pool } from 'pg';

type Request = { method?: string; body?: { barcode?: unknown } };
type Response = { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };

let pool: Pool | undefined;
function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

async function ensureSchema() {
  await database().query(`CREATE TABLE IF NOT EXISTS scan_history (
    id BIGSERIAL PRIMARY KEY,
    barcode VARCHAR(64) NOT NULL,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    await ensureSchema();
    if (req.method === 'GET') {
      const result = await database().query('SELECT barcode, scanned_at FROM scan_history ORDER BY scanned_at DESC LIMIT 100');
      res.status(200).json({ scans: result.rows });
      return;
    }
    if (req.method === 'POST') {
      const barcode = String(req.body?.barcode ?? '').replace(/[^0-9A-Za-z-]/g, '').slice(0, 64);
      if (!barcode) { res.status(400).json({ error: 'A valid barcode is required.' }); return; }
      await database().query('INSERT INTO scan_history (barcode) VALUES ($1)', [barcode]);
      res.status(201).json({ barcode });
      return;
    }
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Scan history API error', error);
    res.status(500).json({ error: 'Scan history is temporarily unavailable.' });
  }
}
