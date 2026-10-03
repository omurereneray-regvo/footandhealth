import { clearSession, sessionFromRequest } from '../_lib/auth';
import { ApiRequest, ApiResponse } from '../_lib/http';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'DELETE') { clearSession(res); res.status(204).json({}); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed.' }); return; }
  const user = sessionFromRequest(req);
  res.status(200).json({ user: user ? { id: user.userId, email: user.email, displayName: user.displayName, avatarUrl: user.avatarUrl } : null });
}
