import { requireSession } from './_lib/auth';
import { database, ensureSchema } from './_lib/db';
import { ApiRequest, ApiResponse, bodyOf } from './_lib/http';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const session = await requireSession(req, res); if (!session) return;
    await ensureSchema();
    if (req.method === 'GET') {
      const result = await database().query('SELECT barcode, scanned_at FROM scan_history WHERE user_id = $1 ORDER BY scanned_at DESC LIMIT 100', [session.userId]);
      res.status(200).json({ scans: result.rows });
      return;
    }
    if (req.method === 'POST') {
      const barcode = String(bodyOf<{ barcode: unknown }>(req.body).barcode ?? '').replace(/[^0-9A-Za-z-]/g, '').slice(0, 64);
      if (!barcode) { res.status(400).json({ error: 'A valid barcode is required.' }); return; }
      await database().query('INSERT INTO scan_history (barcode, user_id) VALUES ($1, $2)', [barcode, session.userId]);
      res.status(201).json({ barcode });
      return;
    }
    res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Scan history API error', error);
    res.status(500).json({ error: 'Scan history is temporarily unavailable.' });
  }
}
