import { randomUUID } from 'node:crypto';
import { cookie, ApiRequest, ApiResponse, cookieHeader } from '../../_lib/http';
import { cleanEmail, makeSession, sessionFromRequest, setSession } from '../../_lib/auth';
import { database, ensureSchema } from '../../_lib/db';

const STATE_COOKIE = 'footandhealth_google_state';
function appUrl() { return process.env.APP_URL?.replace(/\/$/, '') || 'https://footandhealth.vercel.app'; }
function failed(res: ApiResponse, message: string) { res.redirect(302, `${appUrl()}/?authError=${encodeURIComponent(message)}`); }

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed.' }); return; }
  const code = typeof req.query?.code === 'string' ? req.query.code : '';
  const state = typeof req.query?.state === 'string' ? req.query.state : '';
  const savedState = cookie(req, STATE_COOKIE);
  const clientId = process.env.GOOGLE_CLIENT_ID; const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!code || !state || state !== savedState || !sessionFromRequest({ headers: { cookie: `footandhealth_session=${state}` } }) || !clientId || !clientSecret) { failed(res, 'Google girişi doğrulanamadı.'); return; }
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: `${appUrl()}/api/auth/google/callback`, grant_type: 'authorization_code' }) });
    const tokens = await tokenResponse.json() as { access_token?: string };
    if (!tokenResponse.ok || !tokens.access_token) { failed(res, 'Google girişi tamamlanamadı.'); return; }
    const infoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const info = await infoResponse.json() as { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string };
    const email = cleanEmail(info.email);
    if (!infoResponse.ok || !info.sub || !info.email_verified || !/^\S+@\S+\.\S+$/.test(email)) { failed(res, 'Google hesabının e-posta bilgisi doğrulanamadı.'); return; }
    await ensureSchema();
    const existing = (await database().query('SELECT id, email, display_name, avatar_url FROM app_users WHERE google_subject = $1 OR email = $2 LIMIT 1', [info.sub, email])).rows[0];
    const displayName = String(info.name || email.split('@')[0]).trim().slice(0, 80) || 'Foot & Health kullanıcısı';
    let user = existing;
    if (user) {
      user = (await database().query('UPDATE app_users SET google_subject = $1, display_name = $2, avatar_url = COALESCE(avatar_url, $3), updated_at = NOW() WHERE id = $4 RETURNING id, email, display_name, avatar_url', [info.sub, displayName, info.picture ?? null, user.id])).rows[0];
    } else {
      const id = randomUUID();
      user = (await database().query('INSERT INTO app_users (id, email, display_name, google_subject, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, display_name, avatar_url', [id, email, displayName, info.sub, info.picture ?? null])).rows[0];
      await database().query('INSERT INTO user_profiles (user_id, avatar_url) VALUES ($1, $2)', [id, info.picture ?? null]);
    }
    setSession(res, { userId: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url });
    res.setHeader('Set-Cookie', [cookieHeader(STATE_COOKIE, '', 0), cookieHeader('footandhealth_session', makeSession({ userId: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url }), 60 * 60 * 24 * 30)]);
    res.redirect(302, `${appUrl()}/?signedIn=1`);
  } catch (error) { console.error('Google OAuth callback error', error); failed(res, 'Google girişi şu anda tamamlanamadı.'); }
}
