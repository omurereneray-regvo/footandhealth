import { randomBytes } from 'node:crypto';
import { makeSession } from '../../_lib/auth';
import { ApiRequest, ApiResponse, cookieHeader } from '../../_lib/http';

const STATE_COOKIE = 'footandhealth_google_state';
function appUrl() { return process.env.APP_URL?.replace(/\/$/, '') || 'https://footandhealth.vercel.app'; }

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed.' }); return; }
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) { res.status(503).json({ error: 'Google girişi henüz yapılandırılmadı.' }); return; }
  try {
    const state = makeSession({ userId: randomBytes(16).toString('hex'), email: 'state@local', displayName: 'state', avatarUrl: null });
    res.setHeader('Set-Cookie', cookieHeader(STATE_COOKIE, state, 10 * 60));
    const params = new URLSearchParams({ client_id: clientId, redirect_uri: `${appUrl()}/api/auth/google/callback`, response_type: 'code', scope: 'openid email profile', state, prompt: 'select_account' });
    res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  } catch (error) { console.error('Google OAuth start error', error); res.status(500).json({ error: 'Google girişi başlatılamadı.' }); }
}
